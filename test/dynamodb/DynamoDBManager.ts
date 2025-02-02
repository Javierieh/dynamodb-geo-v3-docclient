import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBManager } from "../../src/dynamodb/DynamoDBManager";
import { expect } from "chai";
import { GeoDataManagerConfiguration } from "../../src";

// TODO: Fix tests with the new send api
describe.skip("DynamoDBManager.deletePoint", () => {
  it("calls deleteItem with the correct arguments ", () => {
    let called = false;
    const config = new GeoDataManagerConfiguration(
      {
        send: (args: any) => {
          called = true;
          expect(args).to.deep.equal({
            TableName: "MyTable",
            Key: {
              hashKey: 44,
              rangeKey: "1234",
            },
          });
        },
      },
      "MyTable"
    );

    const ddb = new DynamoDBManager(config);

    ddb.deletePoint({
      RangeKeyValue: "1234",
      GeoPoint: {
        longitude: 50,
        latitude: 1,
      },
    });

    expect(called).to.be.true;
  });
});

// TODO: Fix tests with the new send api
describe.skip("DynamoDBManager.putPoint", () => {
  it("calls putItem with the correct arguments ", () => {
    let called = false;
    const config = new GeoDataManagerConfiguration(
      {
        send: (args: any) => {
          called = true;
          expect(args).to.deep.equal({
            TableName: "MyTable",
            Item: {
              geoJson: '{"type":"Point","coordinates":[-0.13,51.51]}',
              geohash: BigInt("5221366118452580119"),
              hashKey: 52,
              rangeKey: "1234",
              country: "UK",
              capital: "London",
            },
            ConditionExpression: "attribute_not_exists(capital)",
          });
        },
      } as unknown as DynamoDBClient,
      "MyTable"
    );

    const ddb: DynamoDBManager = new DynamoDBManager(config);

    ddb.putPoint({
      RangeKeyValue: "1234", // Use this to ensure uniqueness of the hash/range pairs.
      GeoPoint: {
        // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
        latitude: 51.51,
        longitude: -0.13,
      },
      PutItemInput: {
        // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
        Item: {
          // The primary key, geohash and geojson data is filled in for you
          country: "UK", // Specify attribute values using { type: value } objects, like the DynamoDB API.
          capital: "London",
        },
        ConditionExpression: "attribute_not_exists(capital)",
      },
    });

    expect(called).to.be.true;
  });
});
