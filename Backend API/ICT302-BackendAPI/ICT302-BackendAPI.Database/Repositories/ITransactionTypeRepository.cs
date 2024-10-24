using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface ITransactionTypeRepository
    {
        Task<TransactionType?> CreateTransactionTypeAsync(TransactionType transactionType);
        Task<int?> DeleteTransactionTypeAsync(TransactionType transactionType);
        Task<TransactionType?> GetTransactionTypeByIDAsync(Guid id);
        Task<IEnumerable<TransactionType>?> GetTransactionTypesAsync();
        Task<TransactionType?> UpdateTransactionTypeAsync(TransactionType transactionType);
    }
}
