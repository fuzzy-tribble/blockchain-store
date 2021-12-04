import Client from "../lib/client";

// TODO - get data from gql, etc
export default class Uniswap extends Client {}

// import {
//   graphql,
//   GraphQLArgs,
//   GraphQLObjectType,
//   GraphQLSchema,
//   GraphQLString,
// } from "graphql";

// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: "RootQueryType",
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve() {
//           return "world";
//         },
//       },
//     },
//   }),
// });

// var query = "{ hello }";

// const args: GraphQLArgs = {
//   schema: schema,
//   source: query,
// };

// graphql(args).then(console.log);

// const endpoint = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

// const query = `{
//   tokens {
//     symbol
//     name
//     decimals
//   }
// }`;
