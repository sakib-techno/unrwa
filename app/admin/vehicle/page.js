"use client";
import axiosClient from "@/app/axiosClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
function Vehicle() {
    const [vehicle, setVehicleList] = useState([]);

    const fetchData = async () => {
        try {
            const { data } = await axiosClient.get('vehicle');
            setVehicleList(data.result);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    let tableName = "Vehicle";
    const headName = ["Agency","Vehicle ID","capacity","brand name","body type","armoured","fuel type", "Action"];
    let head = (
        <tr>
            {headName.map((item, index) => (
                <th
                    key={index}
                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                    {item}
                </th>
            ))}
        </tr>
    );

    const body = (
        <>
            {Array.isArray(vehicle) && vehicle.map((item, index) => (

                <tr key={index}>
                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {index+1}
                        </p>

                    </td> */}
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex">
                            {/*<div className="flex-shrink-0 w-10 h-10">*/}
                            {/*    <img*/}
                            {/*        className="w-full h-full rounded-full"*/}
                            {/*        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"*/}
                            {/*        alt=""*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {item.agency && item.agency.name}
                                </p>
                                {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                                {/*    000004*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.vehicle_id}
                        </p>
                        {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                        {/*    USD*/}
                        {/*</p>*/}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex">
                            {/*<div className="flex-shrink-0 w-10 h-10">*/}
                            {/*    <img*/}
                            {/*        className="w-full h-full rounded-full"*/}
                            {/*        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"*/}
                            {/*        alt=""*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {item.capacity}
                                </p>
                                {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                                {/*    000004*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.brand_name}
                        </p>
                        {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                        {/*    USD*/}
                        {/*</p>*/}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.brand_type}
                        </p>
                        {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                        {/*    USD*/}
                        {/*</p>*/}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.armouted}
                        </p>
                        {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                        {/*    USD*/}
                        {/*</p>*/}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.fuel_type}
                        </p>
                        {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                        {/*    USD*/}
                        {/*</p>*/}
                    </td>

                    <td className="relative px-5 py-5 border-b border-gray-200 bg-white text-sm" style={{whiteSpace: 'nowrap'}}>

                            <Link
                                href={{
                                    pathname: '/admin/vehicle/edit',
                                    query: { id: item._id },
                                }}
                                className="px-4 py-2 mx-2 bg-main text-white rounded"
                              > Edit</Link>
                                <button
                                  onClick={async () => {
                                      // Show a confirmation alert
                                      const confirmed = '';

                                      if (confirmed) {
                                          // Make a DELETE request to your API to mark the question as deleted
                                          try {
                                            await axiosClient.delete(`vehicle/${item._id}`, {
                                                  method: 'DELETE',
                                                  headers: {
                                                      'Content-Type': 'application/json',
                                                  },
                                              });
                                              Swal.fire({
                                                title: 'success',
                                                text: 'Successfully Deleted',
                                                icon: 'success',
                                                // confirmButtonText: 'Cool'
                                            })

                                              //setMessage('Delete successfully');
                                              // Remove the deleted question from the state
                                              //setData(data => data.filter(item => item._id !== val._id));
                                              fetchData();
                                          } catch (error) {
                                              console.error("Error deleting question:", error);
                                          }
                                      }
                                  }}
                                  className="px-4 py-2 mx-2 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                  Delete
                              </button>
                                {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                                {/*    000004*/}
                                {/*</p>*/}

                    </td>
                </tr>
            ))}
        </>
    );

    return (
        <div className="flex h-screen overflow-hidden">

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main>
            <div className="container mx-auto px-4 sm:px-8">
              <div className="py-8">
                <div className="flex gap-5 flex-wrap items-center justify-between">
                  <h2 className="text-2xl font-semibold leading-tight">
                  Vehicle

                  </h2>
                </div>
                {/* Table */}
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden border-lite">
                    <table className="min-w-full leading-normal">
                      <thead>
                      {head}
                      </thead>
                      <tbody>
                      {body}

                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    );
}

export default Vehicle;
