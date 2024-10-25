import { Response } from 'express';
import { Parser } from 'json2csv';
import { Request } from 'express';
import fs from 'fs';
// import { dateType } from 'aws-sdk/clients/iam';
const bcrypt = require('bcrypt');

interface fieldsType {
    label: string;
    value: string;
}

export const downloadCSV = (
    res: Response,
    fileName: string,
    fields: fieldsType[],
    data: any[]
) => {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
};

export const removeLocalFile = (localPath: string) => {
    fs.unlink(localPath, (err) => {
        if (err) console.log('Error while removing local files: ', err);
        else {
            console.log('Removed local: ', localPath);
        }
    });
};

export const removeUnusedMulterImageFilesOnError = (req: Request) => {
    try {
        const multerFile = req.file;
        const multerFiles = req.files;

        if (multerFile) {
            // If there is a file uploaded and there is a validation error
            // We want to remove that file
            removeLocalFile(multerFile.path);
        }

        if (multerFiles) {
            /** @type {Express.Multer.File[][]}  */
            const filesValueArray = Object.values(multerFiles);
            // If there are multiple files uploaded for more than one field
            // We want to remove those files as well
            filesValueArray.map((fileFields) => {
                fileFields.map((fileObject: Express.Multer.File) => {
                    removeLocalFile(fileObject.path);
                });
            });
        }
    } catch (error) {
        // fail silently
        console.log('Error while removing image files: ', error);
    }
};

export async function getPasswordHash(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(
    plaintextPasswordAttempt: string,
    hashedPasswordFromDatabase: string
): Promise<boolean> {
    
    let result = await bcrypt.compare(
        plaintextPasswordAttempt,
        hashedPasswordFromDatabase);
        
    if (result){
        return true
    }

    return false;
}
export function formatDate(date:Date) {
    const pad = (number:number, length = 2) => String(number).padStart(length, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds(), 3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// function used to fix the date time while updating a record in db 
export function toMysqlDatetime(date : any){
    const dt = new Date(date);
    const utcDate = new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000));
    return utcDate.toISOString().slice(0, 19).replace('T', ' ');
  }
//To get current date in yyyy-mm-dd format
export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = String(today.getDate()).padStart(2, '0'); // padstart used to prefix 0 if single digit is there

    return `${year}-${month}-${day}`;
};


// get current fianacial year in this format : YY
export function getCurrentFinancialYear() {
    const today = new Date();
    
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // JavaScript months are zero-based (0 = January, 11 = December)

    if (currentMonth >= 4) {
        return `${currentYear.toString().slice(-2)}`;
    } else {
        return `${(currentYear - 1).toString().slice(-2)}`;
    }
}

export const getCurrentCalenderYear = () => {
    return new Date().getFullYear()
}

export const formatOnlyDate = (date: string) => {
    // date.split('T').join('')
    const [Date ]=date.split('T');
    
    return Date
}


export const getCurrentISTDateTime = () => {
    const currentDateTime = new Date();
  
    // Convert current UTC time to IST (UTC +5:30)
    const istOffset = 5 * 60 + 30; // IST offset in minutes
    const istDateTime = new Date(currentDateTime.getTime() + istOffset * 60 * 1000);
  
    // Format IST date and time as "YYYY-MM-DD HH:MM:SS"
    const formattedISTDateTime = istDateTime.toISOString().slice(0, 19).replace('T', ' ');
  
    return formattedISTDateTime;
  };

export const getCurrentISTDate = () => {
const currentDateTime = new Date();

// Convert current UTC time to IST (UTC +5:30)
const istOffset = 5 * 60 + 30; // IST offset in minutes
const istDateTime = new Date(currentDateTime.getTime() + istOffset * 60 * 1000);

// Format IST date as "YYYY-MM-DD"
const formattedISTDate = istDateTime.toISOString().slice(0, 10);

return formattedISTDate;
};