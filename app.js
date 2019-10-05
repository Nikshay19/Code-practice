const express=require('express')
const bodyparser=require('body-parser')
const fs=require('fs')
const app=express()
const port=process.env.PORT||3000
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.listen(port,(err)=>{
    if(!err)
    {
        console.log("App running on port "+port)
    }
    else{
        console.log("Error in setting up port...")
    }
})
app.get('/ret',(req,res)=>{
    res.send(display())
})
app.get('/search/:genre',(req,res)=>{
    const searchByGenre=display()
    if(searchByGenre.length>1)
    {
        const matchGenre=searchByGenre.find(g=>(req.params.genre).toString()===g.genre)
        if(matchGenre)
        {
            const genreBased=[]
            for (var i=searchByGenre.length-1;i>=0;i--)
            {
                if((req.params.genre).toString()===searchByGenre[i].genre)
                {
                    genreBased.push(searchByGenre[i].name)

                }
            }
            res.send(genreBased)
        }
        else{
            return res.send('The requested genre is not found')
        }
    }
    else
    {
        return res.send('Movie List is empty..')
    }
})
app.post('/insert',(req,res)=>{
    const toInsert=display()
    
        const movieList={
            id:(toInsert.length+1)-1,
            name:req.body.name,
            genre:req.body.genre
        }
        toInsert.push(movieList)
        saveMovieList(toInsert)
        res.send(toInsert)
    }
)
app.put('/update',(req,res)=>{
    const toUpdate=display()
    if(toUpdate.length>1)
    {
        const matchedParam=toUpdate.find(f=>req.body.name===f.name)
        if(matchedParam)
        {
            console.log(matchedParam.genre)
            console.log(req.body.genre)
            if(!(req.body.genre===matchedParam.genre))
            {
                matchedParam.genre=req.body.genre
            }
            else
            {
                return res.send('The genre you are trying to update is same')
            }
            saveMovieList(toUpdate)
            res.send(toUpdate)
        }
        else
        {
            return res.send('The entered movie name does not exist')
        }
    }
})
app.delete('/delete/:id',(req,res)=>{
    const deleteMovie=display()
    if(deleteMovie.length>1)
    {
        const searchParamId=deleteMovie.find(i=>parseInt(req.params.id)===i.id)
        if(searchParamId)
        {
            const modifiedMovieList=deleteMovie.indexOf(searchParamId)
            deleteMovie.splice(modifiedMovieList,1)
            for(i=deleteMovie.length-1;i>=0;i--)
            {
                deleteMovie[i].id=i
            }
            saveMovieList(deleteMovie)
            res.send(deleteMovie)
        }
        else
        {
            return res.send('The entered id does not exist')
        }

    }
    else{
        return res.send('Movielist is currently empty!')
    }

})

function saveMovieList(movieObj)
{
    fs.writeFileSync('movie.json',JSON.stringify(movieObj))
}

function display(){
    const movieFile=fs.readFileSync('movie.json')
    const conString=movieFile.toString()
    if(conString.length>1)
    {
        return JSON.parse(conString)
    }
    else
    {
        return []
    }
}