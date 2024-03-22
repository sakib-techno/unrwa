"use client";
import { useState } from "react";
import Swal from 'sweetalert2';
// import {MissionPDF} from "./components/missionPdf";

import axiosClient from "@/app/axiosClient";
import { useSearchParams } from "next/navigation";
import Step1 from "../Step1";
import Step2 from "../Step2";
import Step3 from "../Step3";
import Step4 from "../Step4";
import "../steps.css";

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Note: January is 0
    const year = date.getFullYear();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
}

function Steps() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const searchParames = useSearchParams();
    const mission_id = searchParames.get("id");

    const [data, setData] = useState({
        name: "",
        email: "",
        dob: "",
        gender: "male",
        address: "",
    });
    const dataObject = {
        "leader": null,
        "agency": [],
        "mission_classification": null,
        "movement_date": "",
        "purpose": "",
        "remarks": "",
        "location_list": [{
            "index_no": 0,
            "departure_premise_type": null,
            "departure_installation_name": "",
            "departure_umrah_id": null,
            "departure_umrah_type": 1,
            "departure_time": "",
            "departure_building_code": "",
            "departure_latitude": "",
            "departure_longitude": "",
            "arrival_umrah_type": 1,
            "arrival_time": "",
            "arrival_premise_type": null,
            "arrival_umrah_id": null,
            "mission_cluster": null,
            "arrival_installation_name": "",
            "arrival_latitude": "",
            "arrival_longitude": "",
            "arrival_building_code": "",
        }],
        "vehicle_list": [{
            "index_no": 0,
            "mission": null,
            "vehicle": null,
            "driver": null,
            "agency": null,
            "vehicle_type": "",
            "vehicle_body": "",
            "staff": [],
        }]
    }

    const [storeData, setStoreData] = useState(dataObject);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaffList, setSelectedStaffList] = useState();
    const [agencyList, setAgencyList] = useState([]);
    const [classification, setClassification] = useState([]);
    const [cluster, setcluster] = useState([]);
    const [checkValidation, setCheckValidation] = useState(0);
    const [vehicleStaff, setVehicleStaff] = useState([]);

    const handleChange = (name, value) => {
        let update = {...storeData, [name]: value};
        setStoreData(old => update);
    };
    const locationStore = (value) => {
        let update = {...storeData, location_list: value};
        setStoreData(old => update);
    };
    const vehicleSet = async (value) => {
        console.log('-------list------');
        // let stafList= [...value.map((item) =>...item.staff)];

        const stafList = await value.map((item) => item.staff.map((staffItem) => {
            return staffItem.staff_id
                ; // You might do some processing here
        })).flat();
        setVehicleStaff(stafList);
        // let update =await {...storeData, vehicle_list: value};
        await setStoreData(old => ({...old, vehicle_list: value}));
    };

    const fetchData = async () => {
        try {
            const id = await mission_id;
            const url = `mission/${id}`

            const {data} = await axiosClient.get(url);
            if (data.success) {
                let agency = []
                let mission = data.result.mission;
                let location = data.result.places
                let vicleList = data.result.vehicles
                mission.leader = mission.leader._id;
                mission.movement_date = await formatDate(mission.movement_date);
                let agencyLit = await mission.agency.map(item => {
                    return {
                        agency_id: item.agency_id?item.agency_id._id:null,
                        value: item.agency_id._id,
                        label: item.agency_id.name
                    };
                });
                mission.agency = agencyLit;
                // console.log(location)
                mission.location_list = await location.map((item, index) => {
                    return {
                        "index_no": index,
                        "_id":item._id,
                        ...item,
                        "arrival_premise_type": item.arrival_premise_type?item.arrival_premise_type._id:null,
                        "departure_premise_type": item.departure_premise_type?item.departure_premise_type._id:null,
                        "arrival_umrah_id": item.arrival_umrah_id ? item.arrival_umrah_id._id : null,
                        "departure_umrah_id": item.departure_umrah_id ? item.departure_umrah_id._id : null,
                    }
                });
                mission.places = "",

                    mission.vehicle_list = await vicleList.map((item, index) => {
                        // For each item in vicleList, return a new object with the "index_no" property and all other properties of the item
                        return {
                            "index_no": index,
                            "_id":item._id,
                            "vehicle": item.vehicle._id,
                            "driver": item.driver._id,
                            "agency": item.agency._id,
                            "vehicle_type": item.vehicle.vehicle_type,
                            "vehicle_body": item.vehicle.description,
                            "staff": item.staff.map((item, index) => {
                                return {
                                    staff_id: item.staff_id._id
                                }
                            })
                        };
                    });

                mission.vehicles = [];

                setStoreData(mission)

                // console.log(data.result.mission);
                // setMission(data.result.mission);
                // setplaces(data.result.places);
                // setvehicles(data.result.vehicles);
            }

            // console.log(data.result);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const agenciesSet = async () => {
        try {
            const {data} = await axiosClient.get('agency');
            if (data.success === true) {
                const updatedAgencyList = data.result.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setAgencyList(prevStaffList => [...updatedAgencyList]);
            }
        } catch (error) {
            setAgencyList([]);
        }
    };
    const classificationListSet = async () => {
        try {
            const {data} = await axiosClient.get('misson-classification');
            if (data.success === true) {
                const updatedClassificationList = data.result.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setClassification(prevStaffList => [...updatedClassificationList]);
            }
        } catch (error) {
            setAgencyList([]);
        }
    };

    const missionCluster = async () => {
        try {
            const {data} = await axiosClient.get('mission-cluster');
            console.log(data);
            if (data.success === true) {
                const updatedClassificationList = data.result.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setcluster(prevStaffList => [...updatedClassificationList]);
            }
        } catch (error) {
            setAgencyList([]);
        }
    };

    const staffListSet = async () => {
        try {
            const {data} = await axiosClient.get('staff');
            if (data.success === true) {
                const updatedStaffList = data.result.map(item => ({
                    value: item._id,
                    label: item.name,
                    list: item,
                }));

                setStaffList(prevStaffList => [...updatedStaffList]);
            }
        } catch (error) {
            setStaffList([]);
        }
    };

        fetchData();
        agenciesSet();
        staffListSet();
        missionCluster();
        classificationListSet();

    async function saveMission() {
        var validationError = await checkStep3()
        if (validationError == 1) {
            setCheckValidation(1)
            return false;
        }

        try {
            const response = await axiosClient.post('mission-edit', storeData).then(function (response) {
                setActiveTab(old => 0);
                Swal.fire({
                    title: 'success',
                    text: 'Successfully Mission Updated',
                    icon: 'success',
                    // confirmButtonText: 'Cool'
                })
                // setStoreData(old => dataObject);
            })
                .catch(function (error) {
                    console.log(error.message);
                });
            if (response.data.success == true) {
                alert("Successfully Created")
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const [activeTab, setActiveTab] = useState(0);

    const formElements = [
        <Step1 key={1} data={data} storeData={storeData} checkValidation={checkValidation} cluster={cluster}
               classification={classification}
               staffList={staffList} agencyList={agencyList} getdata={handleChange}/>,
        <Step2 key={2} data={storeData.location_list} emptyLocation={dataObject.location_list[0]}
               checkValidation={checkValidation} locationSet={locationStore}/>,
        <Step3 key={3} data={storeData.vehicle_list} vehicleStaff={vehicleStaff} emptyVehicle={dataObject.vehicle_list[0]}
               checkValidation={checkValidation}
               vehicleStore={vehicleSet}/>,
        <Step4 key={4} data={data} setData={setData}/>,
    ];
    const nextPage = async () => {
        let validationError = 0;
        if (activeTab == 0) validationError = await checkStep1()
        if (activeTab == 1) validationError = await checkStep2()
        if (validationError == 0) {
            setCheckValidation(0)
            setActiveTab((prev) => prev + 1);
        }
    }

    function checkStep1() {
        if (storeData.leader == null ||
            storeData.agency.length == 0 ||
            // storeData.mission_classification == null ||
            storeData.movement_date == "" ||
            storeData.purpose == "" ||
            storeData.remarks == "" ||
            storeData.mission_cluster == null
        ) {
            setCheckValidation(old => 1)
            return 1;
        } else {
            return 0;
        }
    }

    async function checkStep2() {
        var result = 0;
        await storeData.location_list.forEach((item) => {
            if (item.departure_umrah_type == 1) {
                if (item.departure_umrah_id == null || item.departure_building_code == "" || item.departure_premise_type == null) {
                    setCheckValidation(old => 1)
                    result = 1;
                }
            }

            if (item.arrival_umrah_type == 1) {
                if (item.arrival_umrah_id == null || item.arrival_premise_type == null || item.arrival_building_code == "") {
                    setCheckValidation(old => 1)
                    result = 1;
                }
            }

            if (
                // item.departure_installation_name == "" ||
                item.departure_time == "" ||
                item.departure_latitude == "" ||
                item.departure_longitude == "" ||
                item.arrival_time == "" ||
                // item.arrival_installation_name == "" ||
                item.arrival_latitude == "" ||
                item.arrival_longitude == ""
            ) {
                result = 1;
            }
        })
        if (result == 1) {
            setCheckValidation(old => 1)
            return 1;
        } else {
            return 0;
        }
    }

    async function checkStep3() {
        var result = 0;
        await storeData.vehicle_list.forEach((item) => {
            if (
                // item.departure_installation_name == "" ||
                item.vehicle == null ||
                item.driver == null ||
                item.agency == null ||
                item.staff.length == 0
            ) {
                result = 1;
            }
        })
        if (result == 1) {
            setCheckValidation(old => 1)
            return 1;
        } else {
            return 0;
        }
    }

    return (

        <div className="flex h-screen overflow-hidden">

            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <main>
                    <div className="container mx-auto px-4 sm:px-8">
                        <div className="py-8">
                            <main>
                                <div className='px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto'>
                                    <div className='progress-container'>
                                        <div className='progress-bar' id='progress'></div>
                                        <div className={'circle ' + (activeTab >= 0 ? 'active' : '')}>1</div>
                                        <div className={'circle ' + (activeTab >= 1 ? 'active' : '')}>2</div>
                                        <div className={'circle ' + (activeTab >= 2 ? 'active' : '')}>3</div>
                                        {/*<div className='circle'>4</div>*/}
                                    </div>
                                    {/*<div>*/}
                                    {/*<PDFDownloadLink document={<MissionPDF missionId={'sdfsdfsdf'} />} fileName="example.pdf">*/}
                                    {/*{({ blob, url, loading, error }) =>*/}
                                    {/*loading ? 'Loading document...' : 'Download PDF'*/}
                                    {/*}*/}
                                    {/*</PDFDownloadLink>*/}
                                    {/*</div>*/}
                                    <div>{formElements[activeTab]}</div>
                                    <div
                                        className='flex flex-wrap gap-x-6 py-2.5 px-8  fixed bottom-0 right-[18px] justify-end w-[calc(100%-275px)] bg-white z-20 shadow-[0_-3px_3px_0_rgba(0,0,0,.05)]'>
                                        <button
                                            disabled={activeTab === 0 ? "disabled" : ""}
                                            onClick={() => setActiveTab((prev) => prev - 1)}
                                            className={`px-4 py-2 rounded border border-[#333333] bg-transparent text-black transition duration-300 ${
                                                activeTab === 0
                                                    ? "opacity-30"
                                                    : "opacity-100 hover:shadow-[0_0_15px_0_rgba(0,0,0,.3)]"
                                            }`}
                                        >
                                            Back
                                        </button>
                                        <button
                                            disabled={
                                                activeTab === formElements.length - 1
                                                    ? "disabled"
                                                    : ""
                                            }

                                            onClick={nextPage}
                                            className={`px-4 py-2 rounded bg-main text-white transition duration-300 ${
                                                activeTab === formElements.length - 2
                                                    ? "hidden"
                                                    : "opacity-100 hover:shadow-[0_0_15px_0_rgba(0,0,0,.5)]"
                                            }`}
                                        >
                                            Next
                                        </button>
                                        {activeTab === formElements.length - 2 ? (
                                            <button
                                                className='px-4 py-2 rounded bg-main transition duration-300 text-white  hover:shadow-[0_0_15px_0_rgba(0,0,0,.5)]'
                                                onClick={saveMission}
                                            >
                                                Save
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Steps;
