import json
import faiss
import torch
import requests
from PIL import Image
from io import BytesIO
import numpy as np
from transformers import CLIPProcessor, CLIPModel

def build_multimodal_index():
    print("Loading database.json...")
    with open("database.json", 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Detect if CUDA (GPU) is available, otherwise gracefully fall back to CPU
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Hardware detected: {device.upper()}")
    
    print("Loading OpenAI CLIP model (this downloads ~600MB the first time)...")
    model_id = "openai/clip-vit-base-patch32"
    model = CLIPModel.from_pretrained(model_id).to(device)
    processor = CLIPProcessor.from_pretrained(model_id)

    embeddings = []
    valid_items = []

    print(f"Starting image processing for {len(data)} items. This will take some time...")
    
    for idx, item in enumerate(data):
        try:
            # 1. Fetch the image directly into memory
            response = requests.get(item['image_url'], timeout=3)
            response.raise_for_status() # Trigger error if link is dead (404, 403, etc.)
            
            img = Image.open(BytesIO(response.content)).convert("RGB")
            
            # 2. Process image through CLIP
            inputs = processor(images=img, return_tensors="pt").to(device)
            with torch.no_grad():
                image_features = model.get_image_features(**inputs)
                
                # Normalize the vector for accurate cosine similarity search later
                image_features /= image_features.norm(p=2, dim=-1, keepdim=True)
            
            # 3. Store successful results
            embeddings.append(image_features.cpu().numpy()[0])
            valid_items.append(item)
            
        except Exception:
            # Silently skip broken images to keep the terminal clean
            pass
            
        # Print progress every 50 successful items so you know it hasn't frozen
        if len(valid_items) > 0 and len(valid_items) % 50 == 0 and len(valid_items) != len(embeddings)-1:
             print(f"Successfully mapped {len(valid_items)} images...")

    print(f"\nProcessing complete! Yielded {len(valid_items)} valid, working images out of {len(data)}.")

    # Save the cleaned JSON so our server only loads working data
    with open("database_clean.json", "w", encoding="utf-8") as f:
        json.dump(valid_items, f, indent=2)

    # Build the FAISS Vector Database
    print("Building FAISS index...")
    embeddings_np = np.array(embeddings).astype('float32')
    dimension = embeddings_np.shape[1] # 512 dimensions for CLIP
    
    # Inner Product (IP) index is perfect for normalized vectors (equivalent to Cosine Similarity)
    index = faiss.IndexFlatIP(dimension) 
    index.add(embeddings_np)
    
    faiss.write_index(index, "vibe_index.faiss")
    print("Vector database built and saved successfully as 'vibe_index.faiss'!")

if __name__ == "__main__":
    build_multimodal_index()