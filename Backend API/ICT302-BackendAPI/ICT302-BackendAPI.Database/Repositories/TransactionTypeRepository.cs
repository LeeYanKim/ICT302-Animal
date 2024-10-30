using ICT302_BackendAPI.Database.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public class TransactionTypeRepository(SchemaContext ctx) : ITransactionTypeRepository
    {
        public async Task<IEnumerable<TransactionType>?> GetTransactionTypesAsync()
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var transactionTypes = await ctx.TransactionType.ToListAsync();
            transactionTypes.ForEach(a => ctx.TransactionType.Attach(a));
            return transactionTypes;
        }

        public async Task<TransactionType?> GetTransactionTypeByIDAsync(Guid id)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            var transactionType = await ctx.TransactionType.FindAsync(id);
            return transactionType;
        }

        public async Task<TransactionType?> CreateTransactionTypeAsync(TransactionType transactionType)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.TransactionType.Attach(transactionType);
            ctx.TransactionType.Add(transactionType);
            await ctx.SaveChangesAsync();
            return transactionType;
        }

        public async Task<TransactionType?> UpdateTransactionTypeAsync(TransactionType transactionType)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.TransactionType.Update(transactionType);
            await ctx.SaveChangesAsync();
            return transactionType;
        }

        public async Task<int?> DeleteTransactionTypeAsync(TransactionType transactionType)
        {
            if (!await ctx.CheckDbIsAvailable())
                return null;

            ctx.TransactionType.Remove(transactionType);
            return await ctx.SaveChangesAsync();
        }
    }
}
