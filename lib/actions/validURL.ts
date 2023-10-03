export async function validURL(url: string){
    try{
        const parsedURL = new URL(url);
        const hostName = parsedURL.hostname;

        if(hostName.includes('amazon.com') || 
        hostName.includes('amazon.') || 
        hostName.endsWith('amazon')){
            return true;
        }
    }catch(error){
        return false
    }

    return false;
}