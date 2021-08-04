using FlexeDisplay.GlobalModule;
using SQLiteDb;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace FlexeDisplay.App_Code
{
    public class SQliteComLibrary
    {
        // reference object for interop sqlite DB
        public static Connection dbConnection;
        public static Recordset dbRecord;
        public static LicHelper licHelper;
        public static Object objRecordAffected;

        // Access Specifier Public B'coz developer want to specify our own connection string to assign it if require
        public static string connectionString = ConfigurationManager.ConnectionStrings["Flex-eDisplay"].ConnectionString;

        #region CONSTRUCTOR

        SQliteComLibrary()
        {            
            // open connection
            SQliteComLibrary.Open();

        }

        ~SQliteComLibrary()
        {
            // disposing object
            SQliteComLibrary.Dispose();
        }

        #endregion

        #region CONNECTION OBJECT

        //set license 
        public static void SetLicense()
        {
            // instance sqlitedb licence
            licHelper = new LicHelper();

            // set license info
            licHelper.SetLicenseInfo("56GA9K3VP9R882P8CQ3N5EFRSK27T7YEKTH6DXc32SD12989718078840");
        }

        // open
        public static void Open()
        {
          
            // Instantize the connection and command object
            dbConnection = new Connection();           

            // set license
            SQliteComLibrary.SetLicense();

            // Assign configuration connection string
            dbConnection.ConnectionString = connectionString;

            // Open the connection when connection state is close
            if (dbConnection.State != ObjectStateEnum.slStateOpen)
                dbConnection.Open();

        }

        // Close the connection
        public static void Close()
        {
            // Close the connection when its open
            if (dbConnection.State != ObjectStateEnum.slStateClosed)
                dbConnection.Close();

            dbConnection = null;
        }

        // Begin Transaction Method   
        public static void Begintrans()
        {
            // begin transaction
            dbConnection.BeginTrans();
        }

        // Rollback Transaction   
        public static void Rollback()
        {
            dbConnection.RollbackTrans();
        }

        // Commit The Transaction  
        public static void Commit()
        {
            // commit
            dbConnection.CommitTrans();
        }

        // dispose object
        public static void Dispose()
        {
            // dispose object            
            dbConnection = null;
            dbRecord = null;
        }

        #endregion

        #region INLINE QUERY FOR SQLITE DB INTEROP

        // SessionLibrary Selection of Data    
        public static  Recordset dbSelection(string sCommandText)
        {
            try
            {
                // Open Your SessionLibrary
                SQliteComLibrary.Open();              
            
                // Get Command Query to percorm execution
                dbRecord = dbConnection.Execute(sCommandText, out objRecordAffected);               
             
                // send record
                return dbRecord;
            }
            catch (Exception ex)
            {
                // log error
                ClassErrorHandle.ErrorHandle("Error! while selection query", ex);

                // return null
                throw ex;
            }
            finally
            {             
                // if required to dispose SessionLibrary
                SQliteComLibrary.Close();
            }
        }

        // SessionLibrary Execute Query of Data    
        public static Enums.eDbStatus dbExecuteQuery(string sCommandText)
        {
            try
            {
                // Open Your SessionLibrary
                SQliteComLibrary.Open();

                // Get Command Query to percorm execution
                dbRecord = dbConnection.Execute(sCommandText, out objRecordAffected);

                // failed process
                return Enums.eDbStatus.SUCCESS;
            }
            catch (Exception ex)
            {
                // log error
                ClassErrorHandle.ErrorHandle("Error! while execute query", ex);

                // failed process
                return Enums.eDbStatus.FAILED;                
            }
            finally
            {
                // if required to dispose SessionLibrary
                SQliteComLibrary.Close();
            }
        }
     
        #endregion
    }
}