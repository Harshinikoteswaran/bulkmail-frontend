import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx';
import { Mail, Upload, Send, FileText, Users } from 'lucide-react';

const App = () => {
  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList, setEmailList] = useState([])  
  
  const handleMsg = (e) => {
    setMsg(e.target.value);
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, {type: 'binary'});
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailist = XLSX.utils.sheet_to_json(worksheet, {header: 'A'});
      const totalemail = emailist.map((item) => item.A);
      setEmailList(totalemail);
    }
    reader.readAsBinaryString(file);
  }

  const send = () => {
    setStatus(true);
    axios.post("http://localhost:3000/sendmail", { msg: msg, emailList: emailList })
      .then((res) => {
        if (res.data === true) {
          alert("Mails sent successfully");
          setStatus(false);
        } else {
          alert("Error in sending mails");
          setStatus(false);
        }
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BulkMail
            </h1>
          </div>
          <p className="text-gray-600 text-center mt-3 text-lg">
            Send personalized emails to multiple recipients effortlessly
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Email Content Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Email Content</h2>
              </div>
            </div>
            <div className="p-8">
              <textarea 
                onChange={handleMsg} 
                value={msg}
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                placeholder="Write your email message here... Make it engaging and personalized for your recipients."
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Upload Email List</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="border-3 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-700 mb-2">
                    Choose Excel file or drag and drop
                  </span>
                  <span className="text-gray-500">
                    Supports .xlsx, .xls files with email addresses in column A
                  </span>
                  <input 
                    type="file" 
                    onChange={handleFile}
                    className="hidden"
                    accept=".xlsx,.xls"
                  />
                </label>
              </div>
              
              {/* Email Count Display */}
              {emailList.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      {emailList.length} email{emailList.length !== 1 ? 's' : ''} loaded successfully
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Send Button Section */}
          <div className="text-center">
            <button 
              onClick={send}
              disabled={status || !msg.trim() || emailList.length === 0}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:transform-none disabled:hover:shadow-lg transition-all duration-200 text-lg disabled:cursor-not-allowed"
            >
              {status ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending Emails...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Bulk Emails
                </>
              )}
            </button>
            
            {(!msg.trim() || emailList.length === 0) && (
              <p className="text-gray-500 mt-4 text-sm">
                {!msg.trim() ? "Please enter your email message" : "Please upload an email list to continue"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-500">
            <p>Built with React • Secure and reliable email delivery</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App