using System;
using System.Security.Cryptography;
using System.Text;

public static class GuidHelper
{
    // Hash the Firebase UID and convert it to a Guid
    public static Guid ConvertFirebaseUidToGuid(string firebaseUid)
    {
        using (SHA1 sha1 = SHA1.Create())
        {
            byte[] uidBytes = Encoding.UTF8.GetBytes(firebaseUid);
            byte[] hashBytes = sha1.ComputeHash(uidBytes);
            
            byte[] guidBytes = new byte[16];
            Array.Copy(hashBytes, guidBytes, 16);

            return new Guid(guidBytes);
        }
    }
}