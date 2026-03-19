import json
from utils import table, logger, success, error

def lambda_handler(event, context):
    try:
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        trip_id = event["pathParameters"]["id"]
        body = json.loads(event.get("body", "{}"))

        if not body:
            return error("No fields to update", 400)

        update_parts, expr_values, expr_names = [], {}, {}
        for k, v in body.items():
            expr_names[f"#{k}"] = k
            expr_values[f":{k}"] = v
            update_parts.append(f"#{k} = :{k}")

        table.update_item(
            Key={
                "userId": user_id,
                "TripID": trip_id
            },
            UpdateExpression="SET " + ", ".join(update_parts),
            ExpressionAttributeNames=expr_names,
            ExpressionAttributeValues=expr_values
        )
        return success({"message": "Trip updated"})

    except Exception as e:
        logger.error(f"updateTrip error: {e}")
        return error(str(e), 500)