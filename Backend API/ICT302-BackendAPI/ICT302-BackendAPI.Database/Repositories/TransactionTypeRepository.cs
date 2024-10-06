using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class TransactionTypeRepository : ITransactionTypeRepository
    {
        private readonly SchemaContext _ctx;

        public TransactionTypeRepository(SchemaContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IEnumerable<TransactionType>> GetTransactionTypesAsync()
        {
            var transactionTypes = await _ctx.TransactionType.ToListAsync();
            return transactionTypes;
        }

        public async Task<TransactionType> GetTransactionTypeByIDAsync(Guid id)
        {
            var transactionType = await _ctx.TransactionType.FindAsync(id);
            return transactionType;
        }

        public async Task<TransactionType> CreateTransactionTypeAsync(TransactionType transactionType)
        {
            _ctx.TransactionType.Add(transactionType);
            await _ctx.SaveChangesAsync();
            return transactionType;
        }

        public async Task<TransactionType> UpdateTransactionTypeAsync(TransactionType transactionType)
        {
            _ctx.TransactionType.Update(transactionType);
            await _ctx.SaveChangesAsync();
            return transactionType;
        }

        public async Task<int> DeleteTransactionTypeAsync(TransactionType transactionType)
        {
            _ctx.TransactionType.Remove(transactionType);
            return await _ctx.SaveChangesAsync();
        }
    }
}
