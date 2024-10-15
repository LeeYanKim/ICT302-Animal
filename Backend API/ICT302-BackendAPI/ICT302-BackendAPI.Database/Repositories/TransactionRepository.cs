using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly SchemaContext _ctx;

        public TransactionRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<Transaction>> GetTransactionsAsync()
        {
            var transactions = await _ctx.Transaction.ToListAsync();
            return transactions;
        }

        public async Task<Transaction?> GetTransactionByIDAsync(Guid id)
        {
            var transaction = await _ctx.Transaction.FindAsync(id);
            return transaction;
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transaction)
        {
            _ctx.Transaction.Attach(transaction);
            _ctx.Transaction.Add(transaction);
            await _ctx.SaveChangesAsync();
            return transaction;
        }

        public async Task<Transaction> UpdateTransactionAsync(Transaction transaction)
        {
            _ctx.Transaction.Update(transaction);
            await _ctx.SaveChangesAsync();
            return transaction;
        }

        public async Task<int> DeleteTransactionAsync(Transaction transaction)
        {
            _ctx.Transaction.Remove(transaction);
            return await _ctx.SaveChangesAsync();
        }
    }
}
