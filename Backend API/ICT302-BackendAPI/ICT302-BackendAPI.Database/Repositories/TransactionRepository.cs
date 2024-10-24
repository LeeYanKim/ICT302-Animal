using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class TransactionRepository(SchemaContext ctx) : ITransactionRepository
    {
        public async Task<IEnumerable<Transaction>?> GetTransactionsAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var transactions = await ctx.Transaction.ToListAsync();
            transactions.ForEach(a => ctx.Transaction.Attach(a));
            return transactions;
        }

        public async Task<Transaction?> GetTransactionByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var transaction = await ctx.Transaction.FindAsync(id);
            return transaction;
        }

        public async Task<Transaction?> CreateTransactionAsync(Transaction transaction)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Transaction.Attach(transaction);
            ctx.Transaction.Add(transaction);
            await ctx.SaveChangesAsync();
            return transaction;
        }

        public async Task<Transaction?> UpdateTransactionAsync(Transaction transaction)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Transaction.Update(transaction);
            await ctx.SaveChangesAsync();
            return transaction;
        }

        public async Task<int?> DeleteTransactionAsync(Transaction transaction)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.Transaction.Remove(transaction);
            return await ctx.SaveChangesAsync();
        }
    }
}
