using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace FlexeDisplay.App_Code
{
    public class MySqlLibrary
    {
         // Create reference MySql reference object
        #region COMMON VARIABLES

        private static MySqlConnection dbConnection;
        private static MySqlCommand dbCommand;
        private static MySqlDataAdapter dbAdapter;
        private static MySqlTransaction dbTransaction;

        // Access Specifier Public B'coz developer want to specify our own connection string to assign it if require
        public static string connectionString = ConfigurationManager.ConnectionStrings["Flex-eDisplayData"].ConnectionString;       
        //  public static string connectionString =  "Server=192.124.120.109;User ID=root;Password=Test;Database=testdb;pooling=false;";

        #endregion

        #region PROPERTIES

        // basic properties for MySql to handle their transaction
        public static Boolean isBeginTrans { get; set; }
        public static Boolean isCommit { get; set; }
        public static Boolean isDispose { get; set; }

        #endregion

        #region CONTRUCTOR

        // Default constructor is open the MySqlLibrary connection
        public MySqlLibrary()
        {            
            MySqlLibrary.Open();
        }

        #endregion

        #region DESTRUCTOR

        // Default destructor will destroy the MySqlLibrary reference object when out of scope
        ~MySqlLibrary()
        {
            MySqlLibrary.Dispose();
        }

        #endregion

        #region MYSQL CREATE PARAMETER
        
        // Create MySql Parameter for stored procedure      
        public static MySqlParameter CreateParameter(string ParaName, int ParaSize, DbType ParaType, ParameterDirection ParaDirection, Object ParaValue)
        {
            MySqlParameter para = new MySqlParameter();
            para.ParameterName = ParaName;
            para.Size = ParaSize;
            para.DbType = ParaType;
            para.Direction = ParaDirection;
            para.Value = ParaValue;
            return para;
        }
        
        // Create Out Parameter    
        public static MySqlParameter CreateOutParameter()
        {
            // OutPut Parameter
            MySqlParameter ParaOutput = new MySqlParameter();

            // set status code parameter name
            ParaOutput.ParameterName = "StatusCode";

            // type integer
            ParaOutput.MySqlDbType = MySqlDbType.Int32;

            // always direction output
            ParaOutput.Direction = ParameterDirection.Output;

            // pass default error value
            ParaOutput.Value = 2;

            // return parameter
            return ParaOutput;
        }

        #endregion

        #region SESSION OBJECT

        // Open the MySql Connection method        
        public static void Open()
        {
           
            // Instantize the connection and command object
            dbConnection = new MySqlConnection();
            dbCommand = new MySqlCommand();

            // Assign configuration connection string
            dbConnection.ConnectionString = connectionString;

            // Open the connection when connection state is close
            if (dbConnection.State != ConnectionState.Open)
                dbConnection.Open();

            // add connection reference object to the MySql command
            dbCommand.Connection = dbConnection;
        }
        
        // Close the connection
        public static void Close()
        {
            // Close the connection when its open
            if (dbConnection.State != ConnectionState.Closed)
                dbConnection.Close();
        }
        
        // Begin Transaction Method   
        public static void Begintrans()
        {

            // Check Whether developer want to initialize transaction with connection object
            if (isBeginTrans)
            {
                // Add reference of transaction to MySql object
                dbTransaction = dbConnection.BeginTransaction();
                dbCommand.Transaction = dbTransaction;
            }
        }
        
        // Rollback Transaction   
        public static void Rollback()
        {
            // Check Whether transaction is in used to then rollback the transaction
            if (dbTransaction != null)
                dbTransaction.Rollback();
        }
        
        // Commit The Transaction  
        public static void Commit()
        {
            // If developer want to commit on certain circumstances then developer commit the transaction
            if (isCommit)
            {
                dbTransaction.Commit();
                dbTransaction = null;
            }
        }
        
        // Dispose the MySql Reference Object      
        public static void Dispose()
        {
            // Dispose MySql reference object
            if (isDispose)
            {
                if (dbCommand != null) dbCommand.Dispose();
                if (dbTransaction != null) dbTransaction.Dispose();
                if (dbConnection != null) dbConnection.Dispose();
            }
        }
        
        // FLush the MySql reference properties      
        public static void Flush()
        {
            // Disable all process of transaction
            isBeginTrans = false;
            isCommit = false;
            isDispose = false;
        }

        #endregion

        #region IN-LINE QUERY EXECUTION PROCESS

        // MySqlLibrary Selection of Data    
        public static DataTable dbSelection(string sQuery)
        {
            try
            {
                // Open Your MySqlLibrary
                MySqlLibrary.Open();

                // Check wether to open transaction or not
                MySqlLibrary.Begintrans();

                // Get Command Query to percorm execution
                dbCommand.CommandText = sQuery;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.Text;

                // initialize dataadapter
                dbAdapter = new MySqlDataAdapter();

                // confgiure adapter with command
                dbAdapter.SelectCommand = dbCommand;

                // mae datatable object to collect data
                DataTable dt = new DataTable();

                // fill datatable with collect obect
                dbAdapter.Fill(dt);

                // commit MySqlLibrary
                MySqlLibrary.Commit();

                // return collect object to required entity
                return dt;
            }
            catch (Exception ex)
            {
                // exception throw
                throw ex;
            }
            finally
            {
                // if required to dispose MySqlLibrary
                MySqlLibrary.Dispose();
            }
        }
        
        // MySqlLibrary Scalar of value    
        public static String dbScalar(string sQuery)
        {
            try
            {

                // Open Your MySqlLibrary
                MySqlLibrary.Open();

                // Get Command Query to percorm execution
                dbCommand.CommandText = sQuery;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.Text;

                // initialize dataadapter
                dbAdapter = new MySqlDataAdapter();

                // Get Command Query to percorm execution
                dbAdapter.SelectCommand = dbCommand;

                // create object to hold scalar value
                string sScalar = string.Empty;

                // retrieve scalar value
                sScalar = dbCommand.ExecuteScalar().ToString();

                // return scalar value
                return sScalar;

            }
            catch (Exception ex)
            {
                // exception throw
                throw ex;
            }
            finally
            {
                MySqlLibrary.Dispose();
            }
        }
        
        // Execute Query without parameter    
        public static Boolean dbExecuteQuery(string sQuery)
        {
            try
            {
                // Open Your MySqlLibrary
                MySqlLibrary.Open();

                // Check wether to open transaction or not
                MySqlLibrary.Begintrans();

                // Get Command Query to perform execution
                dbCommand.CommandText = sQuery;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.Text;

                // Execute Query
                dbCommand.ExecuteNonQuery();

                // MySqlLibrary Commit , if developer require commit the transaction
                MySqlLibrary.Commit();

                // return true , if successfull done
                return true;
            }
            catch (Exception ex)
            {
                // MySqlLibrary rollback ,if any error occur
                MySqlLibrary.Rollback();

                // return false, if any error occur
                return false;

                // exception throw
                throw ex;
            }
            finally
            {
                // if required to dispose MySqlLibrary
                MySqlLibrary.Dispose();
            }
        }
        
        // Execute Query with parameter      
        public static Boolean dbExecuteQuery(string sQuery, ArrayList Parameter)
        {
            try
            {
                // Open Your MySqlLibrary
                MySqlLibrary.Open();

                // Check wether to open transaction or not
                MySqlLibrary.Begintrans();


                // Get Command Query to perform execution
                dbCommand.CommandText = sQuery;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.Text;

                // Retrieve parameter of Query
                foreach (MySqlParameter para in Parameter)
                    dbCommand.Parameters.Add(para);

                // Exceute Query
                dbCommand.ExecuteNonQuery();

                // MySqlLibrary Commit , if developer require commit the transaction
                MySqlLibrary.Commit();

                // return true , if successfull done
                return true;
            }
            catch (Exception ex)
            {
                // MySqlLibrary rollback ,if any error occur
                MySqlLibrary.Rollback();

                // return false, if any error occur
                return false;

                // exception throw
                throw ex;
            }
            finally
            {
                // if required to dispose MySqlLibrary
                MySqlLibrary.Dispose();
            }
        }

        #endregion

        #region STORED PROCEDURE FUNCTION

        // MySqlLibraryLibrary Selection of Stored Procedure Data     
        public static DataTable dbSPSelection(String sSPName, Object Parameter)
        {
            try
            {
                // Open Your MySqlLibraryLibrary
                MySqlLibrary.Open();

                // Get Command Query to percorm execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // Retrieve parameter of Query
                IList<PropertyInfo> props = new List<PropertyInfo>(Parameter.GetType().GetProperties());
                foreach (PropertyInfo prop in props)
                {
                    string PropName = prop.Name;                                //  Property Name
                    var propValue = prop.GetValue(Parameter, null);             //  Property Value

                    dbCommand.Parameters.Add(new MySqlParameter(PropName, propValue));
                    // Do something with propValue
                }

                // initialize dataadapter
                dbAdapter = new MySqlDataAdapter();

                // confgiure adapter with command
                dbAdapter.SelectCommand = dbCommand;

                // mae datatable object to collect data
                DataTable dt = new DataTable();

                // fill datatable with collect obect
                dbAdapter.Fill(dt);

                // return collect object to required entity
                return dt;
            }
            catch (Exception ex)
            {
                // exception throw
                throw ex;
            }
            finally
            {
                // set dispose true
                MySqlLibrary.isDispose = true;

                // if required to dispose MySqlLibrary
                MySqlLibrary.Dispose();

                // flush sess object
                MySqlLibrary.Flush();

            }
        }
        
        // MySqlLibraryLibrary Selection of Stored Procedure Data    
        public static DataTable dbSPSelection(String sSPName)
        {
            try
            {
                // Open Your MySqlLibraryLibrary
                MySqlLibrary.Open();

                // Get Command Query to percorm execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // initialize dataadapter
                dbAdapter = new MySqlDataAdapter();

                // confgiure adapter with command
                dbAdapter.SelectCommand = dbCommand;

                // mae datatable object to collect data
                DataTable dt = new DataTable();

                // fill datatable with collect obect
                dbAdapter.Fill(dt);

                // return collect object to required entity
                return dt;
            }
            catch (Exception ex)
            {
                // exception throw
                throw ex;
            }
            finally
            {
                // set dispose true
                MySqlLibrary.isDispose = true;

                // if required to dispose MySqlLibrary
                MySqlLibrary.Dispose();

                // flush sess object
                MySqlLibrary.Flush();
            }
        }
        
        // Execute Query without pass save update from class object    
        public static List<int> dbSPExecute(string sSPName, Object Parameter)
        {
            try
            {
                // set true all for one process transaction
                MySqlLibrary.isBeginTrans = true;
                MySqlLibrary.isCommit = true;
                MySqlLibrary.isDispose = true;

                // Open Your MySqlLibraryLibrary
                MySqlLibrary.Open();

                // begin transa
                MySqlLibrary.Begintrans();

                // Get Command Query to perform execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // clear previous added parameter if any
                dbCommand.Parameters.Clear();

                // Retrieve parameter of Query
                IList<PropertyInfo> props = new List<PropertyInfo>(Parameter.GetType().GetProperties());
                foreach (PropertyInfo prop in props)
                {
                    string PropName = prop.Name;                                //  Property Name
                    var propValue = prop.GetValue(Parameter, null);             //  Property Value

                    // create parameter
                    MySqlParameter para = new MySqlParameter();
                    para.ParameterName = PropName;

                    try
                    {
                        // retrieve inner object primary value
                        para.Value = propValue.GetType().GetProperty("pId").GetValue(propValue, null);
                    }
                    catch
                    {
                        para.Value = propValue;
                    }

                    // If parameter is ID then both have input and output direction
                    if (PropName.ToUpper().Equals("PID"))
                        para.Direction = ParameterDirection.InputOutput;
                    else
                        para.Direction = ParameterDirection.Input;

                    // if proprty value is not equal null
                    if (propValue != null)
                    {
                        // Retrieve size of property value
                        if (propValue.GetType() == typeof(byte[]))
                            para.Size = ((byte[])propValue).Length;
                    }


                    dbCommand.Parameters.Add(para);
                    // Do something with propValue
                }

                // add Output parameter i.e. StatusCode execution process
                dbCommand.Parameters.Add(CreateOutParameter());

                // Execute Query
                dbCommand.ExecuteNonQuery();

                // @Commit
                MySqlLibrary.isCommit = true;
                MySqlLibrary.Commit();

                // retrive status code and primary key if insertion id of execution process
                List<int> _lst = new List<int>()
                {
                    Convert.ToInt32(dbCommand.Parameters["PID"].Value),
                    Convert.ToInt32(dbCommand.Parameters["StatusCode"].Value)
                };

                // return code
                return _lst;
            }
            catch (Exception ex)
            {
                // MySqlLibrary rollback ,if any error occur
                MySqlLibrary.Rollback();

                // return false, if any error occur
                return null;

                // exception throw
                throw ex;
            }
            finally
            {

                // set dispose object
                MySqlLibrary.isDispose = true;

                // disposing object
                MySqlLibrary.Dispose();
                MySqlLibrary.Flush();

                // @Close Connection
                MySqlLibrary.Close();
            }
        }

        // Delete
        public static int dbSPDeleteQuery(string sSPName, int Id)
        {
            try
            {
                // set true all for one process transaction
                MySqlLibrary.isBeginTrans = true;
                MySqlLibrary.isCommit = true;
                MySqlLibrary.isDispose = true;

                // Open Your MySqlLibraryLibrary
                MySqlLibrary.Open();

                // Check wether to open transaction or not
                MySqlLibrary.Begintrans();

                // Get Command Query to perform execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // create parameter
                MySqlParameter para = new MySqlParameter();
                para.ParameterName = "pId";
                para.Value = Id;
                para.Direction = ParameterDirection.Input;

                // Do something with propValue
                dbCommand.Parameters.Add(para);

                // add Output parameter i.e. StatusCode execution process
                dbCommand.Parameters.Add(CreateOutParameter());

                // Execute Query
                dbCommand.ExecuteNonQuery();

                // MySqlLibraryLibrary Commit , if developer require commit the transaction
                MySqlLibrary.isCommit = true;
                MySqlLibrary.Commit();

                // retrive status code  of execution process
                int iStatusCode = Convert.ToInt32(dbCommand.Parameters["StatusCode"].Value);

                // return code
                return iStatusCode;
            }
            catch (Exception ex)
            {
                // Error Handling
                ClassErrorHandle.ErrorHandle("Error ! While dbSPDeleteQuery on session layer", ex);

                // MySqlLibrary rollback ,if any error occur
                MySqlLibrary.Rollback();

                // return false, if any error occur
                return 2;                
            }
            finally
            {

                // set dispose object
                MySqlLibrary.isDispose = true;

                // disposing object
                MySqlLibrary.Dispose();
                MySqlLibrary.Flush();

                // @Close Connection
                MySqlLibrary.Close();
            }
        }

        #endregion

        #region STORED PROCEDURE EXECUTE PROCESS FOR TRANSACTION
        
        // Execute Query without pass save update from class object     
        public static List<int> dbSPSaveUpdateExecute(string sSPName, Object Parameter)
        {
            try
            {

                // Get Command Query to perform execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // clear previous added parameter if any
                dbCommand.Parameters.Clear();

                // Retrieve parameter of Query
                IList<PropertyInfo> props = new List<PropertyInfo>(Parameter.GetType().GetProperties());
                foreach (PropertyInfo prop in props)
                {
                    string PropName = prop.Name;                                //  Property Name
                    var propValue = prop.GetValue(Parameter, null);             //  Property Value

                    // create parameter
                    MySqlParameter para = new MySqlParameter();
                    para.ParameterName = PropName;

                    try
                    {
                        // retrieve inner object primary value
                        para.Value = propValue.GetType().GetProperty("pId").GetValue(propValue, null);
                    }
                    catch
                    {
                        para.Value = propValue;
                    }

                    // If parameter is ID then both have input and output direction
                    if (PropName.ToUpper().Equals("PID"))
                        para.Direction = ParameterDirection.InputOutput;
                    else
                        para.Direction = ParameterDirection.Input;

                    // if proprty value is not equal null
                    if (propValue != null)
                    {
                        // Retrieve size of property value
                        if (propValue.GetType() == typeof(byte[]))
                            para.Size = ((byte[])propValue).Length;
                    }

                    dbCommand.Parameters.Add(para);
                    // Do something with propValue
                }

                // add Output parameter i.e. StatusCode execution process
                dbCommand.Parameters.Add(CreateOutParameter());

                // Execute Query
                dbCommand.ExecuteNonQuery();


                // retrive status code and primary key if insertion id of execution process
                List<int> _lst = new List<int>()
                {
                    Convert.ToInt32(dbCommand.Parameters["PID"].Value),
                    Convert.ToInt32(dbCommand.Parameters["StatusCode"].Value)
                };

                // return code
                return _lst;
            }
            catch (Exception ex)
            {

                // Error Handling
                ClassErrorHandle.ErrorHandle("Error ! While save update transaction process", ex);

                // return false, if any error occur
                return null;

                // exception throw
                throw ex;
            }

        }
        
        // Execute Query without pass save update from arraylist object      
        public static List<int> dbSPSaveUpdateByTransaction(string sSPName, ArrayList Parameter)
        {
            try
            {

                // Get Command Query to perform execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // clear previous added parameter if any
                dbCommand.Parameters.Clear();

                // Retrieve parameter of Query
                foreach (MySqlParameter para in Parameter)
                    dbCommand.Parameters.Add(para);

                // add Output parameter i.e. StatusCode execution process
                dbCommand.Parameters.Add(CreateOutParameter());

                // Execute Query
                dbCommand.ExecuteNonQuery();


                // retrive status code and primary key if insertion id of execution process
                List<int> _lst = new List<int>()
                {
                    Convert.ToInt32(dbCommand.Parameters["PID"].Value),
                    Convert.ToInt32(dbCommand.Parameters["StatusCode"].Value)
                };

                // return code
                return _lst;
            }
            catch (Exception ex)
            {

                // Error Handling
                ClassErrorHandle.ErrorHandle("Error ! While save update transaction process", ex);

                // return false, if any error occur
                return null;

                // exception throw
                throw ex;
            }

        }

        // execute process of delete
        public static int dbSPDeleteByTransaction(string sSPName, int Id)
        {
            try
            {
                // Get Command Query to perform execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // clear previous added parameter if any
                dbCommand.Parameters.Clear();

                // create parameter
                MySqlParameter para = new MySqlParameter();
                para.ParameterName = "pId";
                para.Value = Id;
                para.Direction = ParameterDirection.Input;

                // Do something with propValue
                dbCommand.Parameters.Add(para);

                // add Output parameter i.e. StatusCode execution process
                dbCommand.Parameters.Add(CreateOutParameter());

                // Execute Query
                dbCommand.ExecuteNonQuery();

                // retrive status code  of execution process
                int iStatusCode = Convert.ToInt32(dbCommand.Parameters["StatusCode"].Value);

                // return code
                return iStatusCode;
            }
            catch (Exception ex)
            {
                // Error Handling
                ClassErrorHandle.ErrorHandle("Error ! While delete transaction process", ex);

                // return false, if any error occur
                return 2;
               
            }

        }

        // execute process of delete by self defined parameter
        public static int dbSPDeleteByTransaction(string sSPName, ArrayList Parameter)
        {
            try
            {

                // Get Command Query to perform execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // clear previous added parameter if any
                dbCommand.Parameters.Clear();

                // Retrieve parameter of Query
                foreach (MySqlParameter para in Parameter)
                    dbCommand.Parameters.Add(para);

                // add Output parameter i.e. StatusCode execution process
                dbCommand.Parameters.Add(CreateOutParameter());

                // Execute Query
                dbCommand.ExecuteNonQuery();

                // retrive status code  of execution process
                int iStatusCode = Convert.ToInt32(dbCommand.Parameters["StatusCode"].Value);

                // return code
                return iStatusCode;
            }
            catch (Exception ex)
            {

                // Error Handling
                ClassErrorHandle.ErrorHandle("Error ! While delete transaction process", ex);

                // return false, if any error occur
                return 2;
            
            }
        }

        #endregion

        #region STORED PROCEDURE ARRAY PARAMETER
        
        // MySqlLibraryLibrary Scalar of value 
        public static int dbSPExecute(string sSPName, ArrayList Parameter)
        {
            try
            {

                // set true all for one process transaction
                MySqlLibrary.isBeginTrans = true;
                MySqlLibrary.isCommit = true;
                MySqlLibrary.isDispose = true;


                // Open Your MySqlLibraryLibrary
                MySqlLibrary.Open();


                // begin transa
                MySqlLibrary.Begintrans();


                // Get Command Query to percorm execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // Retrieve parameter of Query
                foreach (MySqlParameter para in Parameter)
                    dbCommand.Parameters.Add(para);


                // add Output parameter i.e. StatusCode execution process
                dbCommand.Parameters.Add(CreateOutParameter());

                // Execute Query
                dbCommand.ExecuteNonQuery();

                // MySqlLibraryLibrary Commit , if developer require commit the transaction
                MySqlLibrary.isCommit = true;
                MySqlLibrary.Commit();

                // retrive status code  of execution process
                int iStatusCode = Convert.ToInt32(dbCommand.Parameters["StatusCode"].Value);

                // return code
                return iStatusCode;


            }
            catch (Exception ex)
            {

                // Error Handling
                ClassErrorHandle.ErrorHandle("Error ! While save update thorugh array list", ex);

                // rollback process
                MySqlLibrary.Rollback();

                // exception throw
                throw ex;
            }
            finally
            {
                // set dispose object
                MySqlLibrary.isDispose = true;

                // disposing object
                MySqlLibrary.Dispose();
                MySqlLibrary.Flush();

                // @Close Connection
                MySqlLibrary.Close();
            }
        }
        
        // MySqlLibraryLibrary Array data value    
        public static DataTable dbSPSelectionArray(string sSPName, ArrayList Parameter)
        {
            try
            {


                // Open Your MySqlLibraryLibrary
                MySqlLibrary.Open();

                // Get Command Query to percorm execution
                dbCommand.CommandText = sSPName;

                // Set Command Type i.e. text type query or storeped procedure type query
                dbCommand.CommandType = CommandType.StoredProcedure;

                // Retrieve parameter of Query
                foreach (MySqlParameter para in Parameter)
                    dbCommand.Parameters.Add(para);


                // initialize dataadapter
                dbAdapter = new MySqlDataAdapter();

                // confgiure adapter with command
                dbAdapter.SelectCommand = dbCommand;

                // mae datatable object to collect data
                DataTable dt = new DataTable();

                // fill datatable with collect obect
                dbAdapter.Fill(dt);

                // return data
                return dt;

            }
            catch (Exception ex)
            {
                // Error Handling
                ClassErrorHandle.ErrorHandle("Error ! While selection thorugh array list", ex);

                return null;
            }
            finally
            {
                // if required to dispose MySqlLibrary
                MySqlLibrary.Close();

                // dispose all object
                MySqlLibrary.isDispose = true;
                MySqlLibrary.Dispose();

                // flush all MySqlLibrary object
                MySqlLibrary.Flush();
            }
        }

        #endregion
    }
}