import os
import time
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

index_name = "niramay-cpic"
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

if index_name not in existing_indexes:
    print(f"Creating index {index_name}...")
    pc.create_index(
        name=index_name,
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )
    # Wait for index to be ready
    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)
    print(f"Index {index_name} is ready!")
else:
    print(f"Index {index_name} already exists.")
