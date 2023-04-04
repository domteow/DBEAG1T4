 ## Prerequisites ##

Please ensure that Docker is set up and running on your local machine. 
  * To install Docker Desktop, you can refer to the following [documentation guide](https://docs.google.com/document/d/1hSqhVbgbclf-eOvBx5BQhaTJHxbUSUN4wZTrLNUMyUk/edit#heading=h.xz50kzoisdio)
  
MySQL Workbench should also be installed in the local computer. 
   * Refer to this [installation guide](https://dev.mysql.com/doc/workbench/en/wb-installing.html) from the MySQL Workbench manual. This includes guides for Windows and MacOS users. 

Ensure that WAMP/MAMP is started

Go to http://localhost/phpmyadmin/ and create a new user: "dbea", leave the password field empty, and allow all Global Privileges.

   1. For Windows users

       ```
       pip install mailjet_rest
       ```
    
   2. For MacOS users

       ```
       python3 -m pip install mailjet_rest
       ```

## Access to database ##

Our MySQL databases are managed by phpMyAdmin. In order to create and populate the databases:

   1. Launch WAMP/MAMP server and access phpMyAdmin through this URL http://localhost/phpmyadmin/

      1. Login credentials for Windows users

         Username: root<br>
         No password required<br>

      2. Login credentials for MacOS users

         Username: root<br>
         Password: root<br>

   2. Navigate to the Import tab

      ![phpMyAdmin Import](images/phpmyadminimport.jpg)

   3. Click on "Choose File" and navigate to ```database``` directory in ```clinic-savers``` repository.

      * Install the following database schemes as shown below

        ![Database Install](images/databaseinstall.jpg)

      * Click on "Go" on the bottom right

        ![Installation screen](images/installscreen.jpg)

   4. The following message will appear if the database has been successfully imported.

      ![Successful import](images/successimport.jpg)

## Access to Frontend UI ##

For the frontend files to function, clinic-savers repository has to be saved in the webroot.

![Location of clinic-savers](images/clinicsaversloc.jpg)

<br>

The patient user process first begins at the [Patient Login Page](http://localhost:3001) where they can login using their NRIC. From then on, patients can access the other services such as finding nearby clinics as well as viewing their appointments.

The clinic staff user process first begins at the [Clinic Login Page](http://localhost/clinic-savers/frontend/clinicLogin.html) where they can login using a username and password. Clinic staff will then be able to access the other services such as prescribing drugs, restocking drugs and viewing patient records.

<br>
Our frontend webpages can also be accessed through these links:

* Clinic Staff 
  * Clinic login: http://localhost/clinic-savers/frontend/clinicLogin.html
  * Clinic-side user type selection: http://localhost/clinic-savers/frontend/user.html
  * Drug prescription: http://localhost/clinic-savers/frontend/prescribeDrug.html
  * Drug restocking: http://localhost/clinic-savers/frontend/restock.html
  * Patient records: http://localhost/clinic-savers/frontend/patientRecords.html
  
* Patient 
  * Patient login: http://localhost:3001
  * Appointment booking: http://localhost/clinic-savers/frontend/patientUI.html
  * Appointment record: http://localhost/clinic-savers/frontend/viewAppointments.html
  * Subsidy card information: http://localhost/clinic-savers/frontend/subsidyCard.html
  

## Features of our application ##

1. Patient http://localhost:3001
   
   * Log in via [MyInfo API](https://public.cloud.myinfo.gov.sg/myinfo/api/myinfo-kyc-v3.2.0.html)

   * Utilising [Google Distance Matrix API](https://developers.google.com/maps/documentation/distance-matrix/overview) to locate a clinic nearest to you.  

   * Make appointment at selected clinic 

   * View appointments by filtering according to date

   * View patient's subsidy cards and add new ones 



2. Clinic http://localhost/clinic-savers/frontend/clinicLogin.html
   
   * There are 9 clinics registered to the medical group. Each clinic utilises similar login credentials. Refer to the table below for each clinic's login credentials. 
   * For testing purposes, you may use any of the usernames and corresponding passwords provided. 
  
       |Clinic ID | Clinic Name | Username      | Password |
       | ----------- | ----------- | ----------- | ----------- |
       | 1| Raffles Medical Anchorvale | 1      | one       |
       | 2| Raffles Medical Ang Mo Kio| 2   | two        |
       | 3| Raffles Medical Anson Centre| 3   | three        |
       | 4| Raffles Medical Bishan| 4   | four        |
       | 5| Raffles Medical Compass One| 5   | five        |
       | 6| Raffles Medical Rivervale Mall| 6   | six        |
       | 7| Raffles Medical Toa Payoh| 7   | seven        |
       | 8| Raffles Medical Hillion Mall | 8   | eight        |
       | 9| Raffles Medical Tampines 1 | 9   | nine        |

   * Clinic staff will be able to access our application to perform the following tasks:

      * Prescribe drugs

      * Restock drugs

      * View patient records

   * With the help of Mailjet API, the supplier will be notified through email whenever a drug's quantity falls below its Safety Stock Level.
  
     * For testing purposes, you may view the email notifications received by the drug suppliers with these login credentials via Gmail. 
  
       * Email: clinicDrugSupplier@gmail.com
       * Password: Jsf83%91ns)9nFe

## References ##

   * tBank API | [Reference](http://tbankonline.com/SMUtBank_API_Help/API%20Documentation.html)

## Course and Team Information ##

IS444 Digital Banking Enterprise Architecture<br>
AY2022-2023, Term 2<br>

## Authors ##

* Bryan Shing Wen Yan bryan.shing.2020@scis.smu.edu.sg<br>
* Bruno Goh Jing Hang bruno.goh.2020@scis.smu.edu.sg<br>
* Jann Chia Rui Qi jann.chia.2020@scis.smu.edu.sg<br>
* Wong Jing Yun jy.wong.2020@scis.smu.edu.sg<br>
* Kelvin Yap kelvin.yap.2020@scis.smu.edu.sg

## Acknowledgement ##

* Professor: Alan Megargel
