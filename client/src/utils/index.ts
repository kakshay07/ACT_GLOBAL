
import { toastError } from "./SweetAlert";

export function downloadCSV(csvData: string, fileName: string) {
    const blob = new Blob([csvData], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; 

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
}


export interface APISuccessResponseInterface {
    data: any;
    message: string;
    statusCode: number;
    success: boolean;
}


// A class that provides utility functions for working with local storage
export class LocalStorage {
    // Get a value from local storage by key
    static get(key: string) {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (err) {
                return null;
            }
        }
        return null;
    }

    // Set a value in local storage by key
    static set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Remove a value from local storage by key
    static remove(key: string) {
        localStorage.removeItem(key);
    }

    // Clear all items from local storage
    static clear() {
        localStorage.clear();
    }
}

export const formatDate = (date: string) => (
    date.slice(0,10).split('-').reverse().join('-')
)
export const formatTime=(time:string)=>{
   return time.slice(0,5).split(':').join(':');
}
export const formatVehicleNo = (vehicleNo:string) => {
    const upperVehicleNo = vehicleNo?.toUpperCase()?.replace(/\s+/g, '');
    return upperVehicleNo?.replace(/([A-Z]{2})(\d{1,2})([A-Z]{1,2})(\d{1,4})/, '$1 $2 $3 $4');
  };

export function getCurrentDateInYYYYMMDD() {
    const date = new Date();

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Format as yyyy-mm-dd
    return `${year}-${month}-${day}`;
}
export const formatDateAndTime=(dateTime:string)=>{
  const [date,time]=dateTime.split('T');
  const Time=time.split('.')[0]
  // return dayjs.utc(dateTime).format('YYYY-MM-DD HH:mm');
  return `${date} ${Time}`
}

export function toMysqlDatetime(date : any){
  const dt = new Date(date);
  const utcDate = new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000));
  return utcDate.toISOString().slice(0, 19).replace('T', ' ');
}

export const getCurrentCalenderYear = () => {
  return new Date().getFullYear()
}


// function print the pdf which is generated in server
export const printPDF = async (pdfArrayBuffer : ArrayBuffer) => {
    try {
  
      // Create a blob from the arraybuffer
      const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
  
      // Open the URL in a new window or tab
      const newWindow = window.open(url, '_blank');
  
      if (newWindow) {
        // Ensure that the new window has fully loaded before attempting to print
        newWindow.onload = () => {
          newWindow.print();
        };
  
        // Release the object URL when it's no longer needed
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000); // Adjust the delay as needed
      } else {
        // Handle the case where the new window could not be opened
        console.error('Failed to open a new window.');
      }
    } catch (error) {
      // Handle errors during the fetch or blob creation
      toastError.fire({
        title : 'Failed to Print PDF'
      })
    }
  };
    // <button
    //     onClick={async ()=>{
    //         const response = await axios.get('/pdf/gatepass', {
    //         responseType: 'arraybuffer'
    //         });
    //         printPDF(response.data)
    //     }}  
    //     >
    //     Print
    // </button>




    export const handlePrintString = (stringToPrint : string) => {
      // Open a new window or tab
      const newWindow = window.open('', '');
      
      if (!newWindow) return;

      // Write the content to the new window
      newWindow?.document.write(stringToPrint);
  
      // Wait for the content to be fully written, then print
      newWindow.document.close();  // Close the document stream
      newWindow.focus();           // Focus on the new window
      newWindow.print();           // Trigger the print dialog
  
      // Optional: Close the window after printing (if you don't want to leave it open)
      newWindow.onafterprint = () => {
        newWindow.close();
      };
      newWindow.oncancel = () => {
        newWindow.close();
      };
    };