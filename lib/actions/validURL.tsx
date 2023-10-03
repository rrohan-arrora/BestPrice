const validURL = (url: string): boolean => {
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

export default validURL;