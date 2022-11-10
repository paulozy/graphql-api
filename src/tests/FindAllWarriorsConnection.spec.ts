// eslint-disable-next-line import/no-extraneous-dependencies
import request from "supertest";

import { data } from "../../database/data";
import { app } from "../server";

describe("Requisitions tests", () => {
  test("Should get all warriors on success", async () => {
    const query = `
    query {
      warriors {
        id
        name
        weapon
      }
    }
  `;

    const response = await request(app).post("/graphql").send({ query });

    expect(response.status).toBe(500);
    expect(response.body.data.warriors).toStrictEqual(data.warriors);
  });

  test("Should get a warrior by id on success", async () => {
    const query = `
    query {
      warrior(id: "1") {
        id
        name
        weapon
      }
    }
  `;

    const response = await request(app).post("/graphql").send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.warrior).toStrictEqual(data.warriors[0]);
  });

  test("Should get a warriors connection on success", async () => {
    const query = `
    query {
      warriorsConnection(first: 2) {
        edges {
          id
          name
          weapon
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

    const response = await request(app).post("/graphql").send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.warriorsConnection.edges).toStrictEqual(
      data.warriors.slice(0, 2)
    );

    expect(response.body.data.warriorsConnection.pageInfo).toStrictEqual({
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: "1",
      endCursor: "2",
    });
  });

  test("Should get a warriors connection with after on success", async () => {
    const query = `
    query {
      warriorsConnection(first: 2, after: "1") {
        edges {
          id
          name
          weapon
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

    const response = await request(app).post("/graphql").send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.warriorsConnection.edges).toStrictEqual([
      data.warriors[1],
      data.warriors[2],
    ]);

    expect(response.body.data.warriorsConnection.pageInfo).toStrictEqual({
      hasNextPage: false,
      hasPreviousPage: true,
      startCursor: "2",
      endCursor: "3",
    });
  });

  test("Should get a warriors connection with last on success", async () => {
    const query = `
    query {
      warriorsConnection(last: 2) {
        edges {
          id
          name
          weapon
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;

    const response = await request(app).post("/graphql").send({ query });

    expect(response.status).toBe(200);
    expect(response.body.data.warriorsConnection.edges).toStrictEqual([
      data.warriors[2],
      data.warriors[3],
    ]);

    expect(response.body.data.warriorsConnection.pageInfo).toStrictEqual({
      hasNextPage: false,
      hasPreviousPage: true,
      startCursor: "3",
      endCursor: "4",
    });
  });
});
