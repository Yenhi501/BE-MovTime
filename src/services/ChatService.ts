import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import type { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ParsedQs } from 'qs';
import { Service } from 'typedi';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '../config/pinecone';
import { makeChain } from '../utils/makechain';
import { pinecone } from '../utils/pinecone-client';
import IChatService from './Interfaces/IChatService';



@Service()
export class ChatService implements IChatService {
    async chat(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<string> {
        try{
            const { question, history } = req.body;
            if (!question) {
                throw new Error('No question in the request');
              }
            const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
            const index = pinecone.Index(PINECONE_INDEX_NAME);
                /* create vectorstore*/
            const vectorStore = await PineconeStore.fromExistingIndex(
                new OpenAIEmbeddings({}),
                {
                pineconeIndex: index,
                textKey: 'text',
                namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
                },
            );

                // Use a callback to get intermediate sources from the middle of the chain
            let resolveWithDocuments: (value: Document[]) => void;

            const retriever = vectorStore.asRetriever({
            callbacks: [
                {
                handleRetrieverEnd(documents) {
                    resolveWithDocuments(documents);
                },
                },
            ],
            });

                //create chain
            const chain = makeChain(retriever);

            const pastMessages = history
            .map((message: [string, string]) => {
                return [`Human: ${message[0]}`, `Assistant: ${message[1]}`].join('\n');
            })
            .join('\n');
            // console.log(pastMessages);

            const response = await chain.invoke({
                question: sanitizedQuestion,
                chat_history: pastMessages,
              });
          
            //   console.log('response', response);
            return response;
        }catch(err){
            throw(err);
        }
    }

}