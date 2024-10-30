using ICT302_BackendAPI.Database.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ICT302_BackendAPI.Database.Repositories
{
    public interface ITransactionRepository
    {
        Task<Transaction?> CreateTransactionAsync(Transaction transaction);
        Task<int?> DeleteTransactionAsync(Transaction transaction);
        Task<Transaction?> GetTransactionByIDAsync(Guid id);
        Task<IEnumerable<Transaction>?> GetTransactionsAsync();
        Task<Transaction?> UpdateTransactionAsync(Transaction transaction);
    }
}
