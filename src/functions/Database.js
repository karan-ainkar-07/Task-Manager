import { Client, Databases, Query } from "appwrite";
import { getCustomTaskId } from "./CustomID";

class DatabaseDB
{
    client;
    database;
    constructor()
    {
        this.client=new Client()
        .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

        this.database=new Databases(this.client);
    }

    async AddTask(data)
    {
        const id=getCustomTaskId();
        try{
            await this.database.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_COLLECTION_ID,
                id,
                data,
            )
            return true;
        }
        catch(error){
            console.log("Unable to add Task " + error);
        }
        finally{
            console.log(id);
        }
    }

    async FetchTask(user) {
        try {
            const response = await this.database.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_COLLECTION_ID,
                [Query.equal('User', user)]
            );
            console.log(user);

            const filteredResponse = response.documents.reduce((acc, task) => {
                acc[task.ID] = task;
                return acc;
            }, {});

            return filteredResponse;
        } catch (error) {
            console.log("Error getting the Tasks: " + error);
        }
    }

    async UpdateStatusMissed(date) {
      try {
        const response = await this.database.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID,
          [
            Query.lessThan("DueDate", date),
            Query.equal("Status","Incomplete")
          ]
        );
      
        const documents = response.documents;
      
        for (const doc of documents) {
          await this.database.updateDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID,
            doc.$id,
            {
              Status: "Missed"
            }
          );
        }
        return true;
      } catch (error) {
        console.log("Failed to update task status:", error);
        return false;
      }
    }


    async UpdateStatus(taskId, date) {
      try {
        const response = await this.database.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID,
          [Query.equal("ID", taskId)]
        );

        if (response.documents.length === 0) {
          console.log("No task found with that ID");
          return false;
        }

        const documentId = response.documents[0].$id;

        await this.database.updateDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID,
          documentId,
          {
            Status: "Completed",
            CompleteDate: date
          }
        );
        console.log("done");
        return true;
      } catch (error) {
        console.log("Failed to update task status:", error);
        return false;
      }
    }

    async DeleteTasks() {
      try {
        const result = await this.database.listDocuments(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_COLLECTION_ID,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(1000)
          ]
        );
      
        const allDocs = result.documents;
      
        if (allDocs.length <= 50) {
          console.log("Nothing to delete");
          return;
        }
      
        const docsToDelete = allDocs.slice(50);
      
        for (const doc of docsToDelete) {
          await this.database.deleteDocument(
            import.meta.env.VITE_DATABASE_ID,
            import.meta.env.VITE_COLLECTION_ID,
            doc.$id
          );
          console.log(`Deleted: ${doc.$id}`);
        }
      } catch (error) {
        console.log("Error deleting tasks:", error);
      }
    } 


}
const Database=new DatabaseDB();
export default Database;