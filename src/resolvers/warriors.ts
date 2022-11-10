import { Warrior } from "../domain/entities";

interface IWarriorsConnectionArgs {
  first: number;
  last: number;
  after: string;
  before: string;
}

interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export const resolvers = {
  Query: {
    warriors: (
      _obj: unknown,
      _args: unknown,
      context: Warrior[]
    ): Warrior[] => {
      const untilVar = "until";

      console.log(untilVar);

      return context;
    },

    warrior: (
      _obj: unknown,
      args: { id: string },
      context: Warrior[]
    ): Warrior => {
      const { id } = args;

      const warrior = context.filter(
        (warrior: Warrior) => warrior.id === id
      )[0];

      return warrior;
    },

    warriorsConnection: (
      _obj: unknown,
      args: IWarriorsConnectionArgs,
      context: Warrior[]
    ) => {
      const { after, before, first, last } = args;

      let edges: Warrior[] = context;
      let pageInfo: IPageInfo = {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      };

      if (first) {
        edges = context.slice(0, first);

        pageInfo = {
          hasNextPage: context.length > first,
          hasPreviousPage: false,
          startCursor: edges[0].id,
          endCursor: edges[edges.length - 1].id,
        };

        if (after) {
          edges = context.slice(
            context.findIndex((warrior: Warrior) => warrior.id === after) + 1,
            context.findIndex((warrior: Warrior) => warrior.id === after) +
              1 +
              first
          );

          pageInfo = {
            hasNextPage: edges.length > first,
            hasPreviousPage: true,
            startCursor: edges[0].id,
            endCursor: edges[edges.length - 1].id,
          };
        }
      }

      if (last) {
        edges = context.slice(context.length - last, context.length);

        pageInfo = {
          hasNextPage: false,
          hasPreviousPage: context.length > last,
          startCursor: edges[0].id,
          endCursor: edges[edges.length - 1].id,
        };

        if (before) {
          edges = context.slice(
            context.findIndex((warrior: Warrior) => warrior.id === before) -
              last,
            context.findIndex((warrior: Warrior) => warrior.id === before)
          );

          pageInfo = {
            hasNextPage: true,
            hasPreviousPage: edges.length > last,
            startCursor: edges[0].id,
            endCursor: edges[edges.length - 1].id,
          };
        }
      }

      return {
        edges,
        pageInfo,
      };
    },
  },
};
