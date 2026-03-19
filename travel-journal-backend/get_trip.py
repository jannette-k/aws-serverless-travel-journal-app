from utils import table, logger, success, error

def lambda_handler(event, context):
    try:
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        trip_id = event["pathParameters"]["id"]

        response = table.get_item(Key={
            "userId": user_id,   
            "TripID": trip_id
        })

        if "Item" not in response:
            return error("Trip not found", 404)

        return success(response["Item"])

    except Exception as e:
        logger.error(f"getTrip error: {e}")
        return error(str(e), 500)