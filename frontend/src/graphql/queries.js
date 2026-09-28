import { gql } from "@apollo/client"; 
 
export const GET_PESSOAS = gql` 
 query GetPessoas { 
   pessoas { 
     id 
     nome 
     email  
   } 
 } 
`;