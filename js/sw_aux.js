//Almacenamiento dinamico
function actualizarCacheDinamico(dynamicCache, req, res){
    
    if(res.ok){
        return caches.open(dynamicCache).then(cache=>{
            cache.put(req, res.clone());
            return res.clone();
        }).catch( err =>{
            
        });
    }
    else{
        return res;
    }

}
