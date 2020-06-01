var jwt = require('jsonwebtoken');

export const handler = async (event: any = {}): Promise<any> => {
    console.log("Starting hello handler.");

    const jwtHeaders = event.headers['Authorization'];
    const decoded = jwt.decode(jwtHeaders);
    const memberStatus = decoded["custom:member_status"];

    var responseBody = {
        "sampleVal1": "Hello API!",
        "member_status": memberStatus
    };

    const response = {
        "statusCode": 200,
        "headers": {
            "demo_header": "value-test-1"
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };

    return response;
}