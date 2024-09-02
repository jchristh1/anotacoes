import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { expenseSchema } from "./schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { expense }: { expense: string } = await req.json();

  const result = await streamObject({
    model: openai("gpt-4-turbo"),
    system:
      "Você categoriza as despesas em uma das seguintes categorias: " +
      "ALIMENTAÇÃO,BARES E RESTAURANTES,CASA,COMPRAS,CUIDADOS PESSOAIS,EDUCAÇÃO,LAZER E HOBBIES,MERCADO,PETS,ROUPAS,SAÚDE,TRANSPORTE,OUTROS." +
      // provide date (including day of week) for reference:
      "The current date is: " +
      new Date()
        .toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          weekday: "short",
        })
        .replace(/(\w+), (\w+) (\d+), (\d+)/, "$4-$2-$3 ($1)") +
      ". Quando nenhuma data for fornecida, use a data atual.",
    prompt: `Por favor, classifique as seguintes despesas: "${expense}"`,
    schema: expenseSchema,
    onFinish({ object }) {
      // save object to database
    },
  });

  return result.toTextStreamResponse();
}
