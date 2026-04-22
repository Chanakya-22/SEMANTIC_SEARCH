import json
import re
from datasets import load_dataset

def prepare_data():
    print("Initiating connection to Hugging Face...")
    print("Downloading 'bhavyagiri/semantic-memes' dataset...")
    
    try:
        dataset = load_dataset("bhavyagiri/semantic-memes", split="train")
    except Exception as e:
        print(f"Failed to fetch dataset. Error: {e}")
        return

    formatted_data = []
    print(f"Successfully downloaded {len(dataset)} raw records.")
    
    # Print the actual columns so we can see what the dataset creator named them
    if len(dataset) > 0:
        print(f"Dataset columns detected: {list(dataset[0].keys())}")

    print("Formatting data schema and extracting URLs...")

    for i, item in enumerate(dataset):
        # 1. Grab the text regardless of what the column is named (input, text, or caption)
        raw_text = str(item.get("input", item.get("text", item.get("caption", ""))))
        
        # 2. Try to get URL from a dedicated column if it exists
        image_url = str(item.get("url", item.get("image_url", ""))).strip()
        
        # 3. If no dedicated column, hunt for the URL buried inside the text string
        if not image_url or not image_url.startswith("http"):
            urls_found = re.findall(r'(https?://[^\s]+)', raw_text)
            if urls_found:
                image_url = urls_found[0] # Grab the first link found
                
        # 4. Clean up: Remove the URL from the text so it doesn't mess up our search later
        vibe_text = raw_text.replace(image_url, "").strip() if image_url else raw_text

        # 5. Only save if we successfully extracted a valid image link
        if image_url and image_url.startswith("http"):
            formatted_data.append({
                "id": i,
                "vibe_text": vibe_text,
                "image_url": image_url,
                "category": "meme"
            })

    output_filename = "database.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(formatted_data, f, indent=2)
        
    print(f"Data preparation complete! Saved {len(formatted_data)} clean records to {output_filename}.")

if __name__ == "__main__":
    prepare_data()