import json
import uuid
from utils import table, logger, success, error

REQUIRED_FIELDS = ["destination", "date", "image_url"]

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        missing = [f for f in REQUIRED_FIELDS if f not in body]
        if missing:
            return error(f"Missing fields: {', '.join(missing)}", 400)

        trip_id = str(uuid.uuid4())
        item = {
            "userId": user_id,
            "TripID": trip_id,
            "destination": body["destination"],
            "date": body["date"],
            "image_url": body.get("image_url") or body.get("imageUrl", ""),
            "notes": body.get("notes", ""),
            "rating": body.get("rating", 5),
            "tags": body.get("tags", [])
        }

        table.put_item(Item=item)
        logger.info(f"Trip created: {trip_id}")
        return success({"message": "Trip created", "trip": item }, 201)

    except Exception as e:
        logger.error(f"createTrip error: {e}")
        return error("Internal server error")