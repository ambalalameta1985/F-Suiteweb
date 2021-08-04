using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Web;

namespace FlexeDisplay.App_Code
{
    /*
     * @Error Handling Class
     * @Log your catch exception error in file 'ErrorLog*.txt'
     */
    public class ClassErrorHandle
    {
        // Check ErrorLog exists or not
        private static string GetFile()
        {
            // Path Error Handling Directory
            string sDirectoryPath = AppDomain.CurrentDomain.GetData("DataDirectory").ToString() + "\\ErrorLog";
            string sFileName = "\\ErrorLog";

            // Check ErrorLog Folder exits or not , if not then create folder of 'ErrorLog'
            if (!Directory.Exists(sDirectoryPath)) Directory.CreateDirectory(sDirectoryPath);

            //Retrieve All Error file exists in descending order from error handling folder
            List<String> _lstFiles = Directory.GetFiles(sDirectoryPath, "ErrorLog*.txt", SearchOption.AllDirectories).OrderByDescending(x => x).ToList();

            // Check files exists or not if no files exits then create new error log file
            if (_lstFiles.Count > 0)
            {
                // retrieve file size
                FileInfo _fileInfo = new FileInfo(_lstFiles[0]);

                // retrieve in MB , if size greater than 1 MB then create new file
                if ((_fileInfo.Length / 1024 / 1024) > 1)
                {
                    sFileName = sDirectoryPath + sFileName + DateTime.Now.ToString("_dd_MMM_yy") + ".txt";
                    File.Create(sFileName).Dispose();
                }
                else
                    sFileName = _lstFiles[0].ToString();      // Retrieve Latest  Error Handling file

            }
            else
            {
                // Create New File of Error from Intial stage
                sFileName = sDirectoryPath + sFileName + DateTime.Now.ToString("_dd_MMM_yy") + ".txt";
                File.Create(sFileName).Dispose();
            }


            // Get Latest File of Error Handling
            return sFileName;
        }

        /// <summary>
        /// Error Handling
        /// </summary>
        /// <param name="sErrorMsg">Message of Error Handling</param>
        public static void ErrorHandle(String sErrorMsg, Exception exObj)
        {
            //Stream writer object
            StreamWriter _sw = null;

            try
            {
                // Retrieve file reference in streamwriter object
                _sw = new StreamWriter(GetFile(), true);

                // Format Error Message
                string sFormatMsg = string.Empty;
                sFormatMsg += Environment.NewLine + Environment.NewLine + sErrorMsg + "   " + DateTime.Now.ToString("dd MMM yy hh:mm tt");
                sFormatMsg += Environment.NewLine + "-------------------------------------------------------";

                // @Message
                if (exObj.Message != null)
                    sFormatMsg += Environment.NewLine + " Message           :" + exObj.Message;

                // @Source
                if (exObj.Source != null)
                    sFormatMsg += Environment.NewLine + " Source            :" + exObj.Source;

                // @Data
                if (exObj.Data != null)
                    sFormatMsg += Environment.NewLine + " Data              :" + exObj.Data;

                // @StackTrace
                if (exObj.StackTrace != null)
                    sFormatMsg += Environment.NewLine + " StackTrace        :" + exObj.StackTrace;

                // @TargetSite
                if (exObj.TargetSite != null)
                    sFormatMsg += Environment.NewLine + " TargetSite        :" + exObj.TargetSite;

                // @InnerException
                if (exObj.InnerException != null)
                    sFormatMsg += Environment.NewLine + " InnerException    :" + exObj.InnerException;

                sFormatMsg += Environment.NewLine + "-------------------------------------------------------";

                // Write Error Message to file
                _sw.WriteLine(sFormatMsg);
            }
            catch
            {
                // free exeption for self writing exception message
            }
            finally
            {
                // Flush streamwriter object
                _sw.Flush();
                _sw.Dispose();
            }
        }
    }
}
