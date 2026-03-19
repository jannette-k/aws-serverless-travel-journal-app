from boto3.dynamodb.conditions import Key
from utils import table, logger, success, error

def lambda_handler(event, context):
    try:
        user_id = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        
        response = table.query(
            KeyConditionExpression=Key("userId").eq(user_id)
        )
        return success(response["Items"])

    except Exception as e:
        logger.error(f"getTrips error: {e}")
        return error(str(e), 500)