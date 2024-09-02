import { DeepPartial } from "ai";
import { z } from "zod";

export const expenseSchema = z.object({
  expense: z.object({
    category: z
      .string()
      .describe(
        "Categoria da anotação.Categorias permitidas:COMPRAS,COMPROMISSOS,IDEIAS,NOTAS,FINANÇAS,LEMBRAR,OUTROS."
      ),
    amount: z.number().describe("Valor da despesa em R$."),
    date: z.string().describe("Data da despesa, no formato dd-MMM."),
    details: z.string().describe("Nome do produto ou serviço."),
    participants: z
      .array(z.string())
      .describe("Participantes das anotações, como nomes de usuários."),
  }),
});

// define a type for the partial notifications during generation
export type PartialExpense = DeepPartial<typeof expenseSchema>["expense"];

export type Expense = z.infer<typeof expenseSchema>["expense"];
