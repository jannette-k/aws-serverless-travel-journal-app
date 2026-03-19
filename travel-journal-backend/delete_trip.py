from utils import table, logger, success, error

def lambda_handler(event, context):
    try:
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        trip_id = event["pathParameters"]["id"]

        table.delete_item(Key={
            "userId": user_id,
            "TripID": trip_id
        })
        return success({"message": "Trip deleted"})

    except Exception as e:
        logger.error(f"deleteTrip error: {e}")
        return error(str(e), 500)