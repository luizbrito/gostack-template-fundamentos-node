import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private sumBalanceByTypes(operator: Type): number {
    return this.transactions
      .filter(t => t.type === operator)
      .reduce((sum, tr) => sum + tr.value, 0);
  }

  public getBalance(): Balance {
    const income = this.sumBalanceByTypes(Type.INCOME);
    const outcome = this.sumBalanceByTypes(Type.OUTCOME);
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, type, value }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });

    const { total } = this.getBalance();
    if (type === Type.OUTCOME && total < value) {
      throw Error('Can not create outcome transaction without a valid balance');
    }
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
