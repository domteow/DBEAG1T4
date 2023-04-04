 ## Prerequisites ##

Please ensure that Docker is set up and running on your local machine. 
  * To install Docker Desktop, you can refer to the following [documentation guide](https://docs.google.com/document/d/1hSqhVbgbclf-eOvBx5BQhaTJHxbUSUN4wZTrLNUMyUk/edit#heading=h.xz50kzoisdio)
  
MySQL Workbench should also be installed in the local computer. 
   * Refer to this [installation guide](https://dev.mysql.com/doc/workbench/en/wb-installing.html) from the MySQL Workbench manual. This includes guides for Windows and MacOS users. 

Ensure that WAMP/MAMP is started

## Access to database ##

Our MySQL databases are managed by phpMyAdmin. In order to create and populate the databases:

   1. Launch WAMP/MAMP server and access phpMyAdmin through this URL http://localhost/phpmyadmin/

      1. Login credentials for Windows users

         Username: root<br>
         No password required<br>

      2. Login credentials for MacOS users

         Username: root<br>
         Password: root<br>
   
   2. Navigate to the User accounts tab and create a new user: "dbea"
      
       * leave the password field empty, and allow all Global Privileges.

   3. Navigate to the Import tab

      

   4. Click on "Choose File" and navigate to ```sql``` directory in the code repository.

      * Load the SQL scripts

   5. The following message will appear if the database has been successfully imported.

      ![Successful import](images/successimport.jpg)
      
## Running the microservices ##
 1. In your terminal, navigate to the ```backend``` folder in the code repository
 2. For both Windows & MacOS users, run
       ```
       docker-compose up -d
       ```

## Access to App interface##



## References ##

   * tBank API | [Reference](http://tbankonline.com/SMUtBank_API_Help/API%20Documentation.html)

## Course and Team Information ##

IS444 Digital Banking Enterprise Architecture<br>
AY2022-2023, Term 2<br>

## Authors ##

* Bryan Shing Wen Yan bryan.shing.2020@scis.smu.edu.sg<br>
* Bruno Goh Jing Hang bruno.goh.2020@scis.smu.edu.sg<br>
* Alvin<br>
* Dominic Teow Zhen Yang<br>
* Kelvin Yap kelvin.yap.2020@scis.smu.edu.sg

## Acknowledgement ##

* Professor: Alan Megargel
