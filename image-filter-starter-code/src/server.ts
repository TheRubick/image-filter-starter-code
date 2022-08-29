import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from "fs";
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {
  let filesToBeDeleted:string[]  = [];
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // TODO IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get( "/filteredimage/", ( req: Request, res: Response ) => {
    let { image_url } = req.query;

    if ( !image_url ) {
      return res.status(400)
                .send(`image url parameter isn't found`);
    }
    
    if(filesToBeDeleted.length > 0)
    {
      fs.unlinkSync(filesToBeDeleted.pop());
    }
    
    let imagePath: string = ""; 
    filterImageFromURL(image_url).then(value => {
      imagePath = value;
      let imageData = fs.readFileSync(imagePath);
      res.status(200).end(imageData);
      //filesToBeDeleted.push(value);
    }).catch(() => {
      res.status(422).send("error in processing the image");
    }).finally(() => {
      deleteLocalFiles([imagePath]);
      //filesToBeDeleted.pop();
    });
    //deleteLocalFiles(filesToBeDeleted);
    //return res.status(200).send(`Welcome to the Cloud, ${image_url}!`);
  } );
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();