"use client"
import React, { useState, useEffect } from 'react';
import MyRequest from './MyRequest';
import LoadingBar from 'react-top-loading-bar';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchPosts = (props) => {
    const [myRequestsProps, setMyRequestsProps] = useState(props.myRequests);
    const [myRequests, setMyRequests] = useState(props.myRequests);
    const [isSliderOpened, setIsSliderOpened] = useState(false);
    const [progress, setProgress] = useState(0);
    const [acceptors, setAcceptors] = useState([]);
    const [data, setData] = useState({ city: "", state: "", district: "", pin: "", bloodGroup: "all", status: "all" });

    useEffect(() => {
        document.getElementById('stateMyR').innerHTML = '<option value="" class="hidden">--select state--</option>';
        document.getElementById('districtMyR').innerHTML = '<option value="" class="hidden">--select district--</option>';
        document.getElementById('cityMyR').innerHTML = '<option value="" class="hidden">--select city--</option>';
        document.getElementById('pinMyR').innerHTML = '<option value="" class="hidden">--select pincode--</option>';
        for (let state in props.data) {
            let option = document.createElement("option");
            option.innerHTML = `${state}`
            option.setAttribute("value", `${state}`);
            option.setAttribute("class", 'text-gray-800');
            document.getElementById("stateMyR").appendChild(option)
        }
    }, [props.data]);

    const change = (e) => {
        if (e.target.name == 'state') {
            setData({ ...data, state: e.target.value, district: '', city: '', pin: '' });
            const temp = myRequestsProps.filter((request) => {
                return (request.state.trim() == e.target.value.trim() && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all'));
            })
            setMyRequests(temp);
            document.getElementById('districtMyR').innerHTML = '<option value="" class="hidden">--select district--</option>';
            document.getElementById('cityMyR').innerHTML = '<option value="" class="hidden">--select city--</option>';
            document.getElementById('pinMyR').innerHTML = '<option value="" class="hidden">--select pincode--</option>';
            for (let state in props.data) {
                if (state == e.target.value) {
                    for (let district in props.data[state]) {
                        let option = document.createElement("option");
                        option.innerHTML = `${district}`
                        option.setAttribute("value", `${district}`);
                        option.setAttribute("class", 'text-gray-800');
                        document.getElementById("districtMyR").appendChild(option)
                    }
                }
            }
        }
        if (e.target.name == 'district') {
            setData({ ...data, district: e.target.value, city: '', pin: '' });
            const temp = myRequestsProps.filter((request) => {
                if (request.state.trim() == data.state.trim() && request.district.trim() == e.target.value.trim() && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all')) {
                    return request;
                }
            })
            setMyRequests(temp);
            document.getElementById('cityMyR').innerHTML = '<option value="" class="hidden">--select city--</option>';
            document.getElementById('pinMyR').innerHTML = '<option value="" class="hidden">--select pincode--</option>';

            for (let state in props.data) {
                if (state == data.state) {
                    for (let district in props.data[state]) {
                        if (district == e.target.value) {
                            for (let city in props.data[state][district]) {
                                let option1 = document.createElement("option");
                                option1.innerHTML = `${city}`
                                option1.setAttribute("value", `${city}`);
                                option1.setAttribute("class", 'text-gray-800');
                                document.getElementById("cityMyR").appendChild(option1);
                            }
                            let cityPinObj = props.data[state][district];
                            let pins = Object.values(cityPinObj);
                            let uniquePins = [...new Set(pins)];
                            uniquePins.sort((a, b) => a - b);
                            for (let zip of uniquePins) {
                                let option2 = document.createElement("option");
                                option2.innerHTML = `${zip}`;
                                option2.setAttribute("value", `${zip}`);
                                option2.setAttribute("class", 'text-gray-800');
                                document.getElementById("pinMyR").appendChild(option2);
                            }
                        }
                    }
                }
            }
        }
        if (e.target.name == 'city') {
            const temp = myRequestsProps.filter((request) => {
                if (request.state.trim() == data.state.trim() && request.district.trim() == data.district.trim() && request.city.trim() == e.target.value.trim() && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all')) {
                    return request;
                }
            })
            setMyRequests(temp);
            for (let state in props.data) {
                if (state == data.state) {
                    for (let district in props.data[state]) {
                        if (district == data.district) {
                            for (let city in props.data[state][district]) {
                                if (city == e.target.value) {
                                    let zip = props.data[state][district][city];
                                    document.getElementById("pinMyR").value = zip;
                                    setData({ ...data, city: e.target.value, pin: zip });
                                }
                            }
                        }
                    }
                }
            }
        }
        if (e.target.name == 'pin') {
            setData({ ...data, pin: e.target.value });
            const temp = myRequestsProps.filter((request) => {
                if (request.state.trim() == data.state.trim() && request.district.trim() == data.district.trim() && request.pin.trim() == e.target.value.trim() && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all')) {
                    return request;
                }
            })
            setMyRequests(temp);
            document.getElementById('cityMyR').innerHTML = '<option value="" class="hidden">--select city--</option>';
            for (let state in props.data) {
                if (state == data.state) {
                    for (let district in props.data[state]) {
                        if (district == data.district) {
                            for (let city in props.data[state][district]) {
                                if (props.data[state][district][city] == e.target.value) {
                                    let option = document.createElement("option");
                                    option.innerHTML = `${city}`;
                                    option.setAttribute("value", `${city}`);
                                    option.setAttribute("class", 'text-gray-800');
                                    document.getElementById("cityMyR").appendChild(option);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (e.target.name === 'bloodGroup') {
            setData({ ...data, bloodGroup: e.target.value });
            const temp = myRequestsProps.filter((request) => {
                if ((request.bloodGroup.trim() == e.target.value.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || e.target.value == 'all') && (request.state.trim() == data.state.trim() || data.state.trim() == '') && (request.district.trim() == data.district.trim() || data.district.trim() == '') && (request.pin.trim() == data.pin.trim() || data.pin.trim() == '') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all')) {
                    return request;
                }
            })
            setMyRequests(temp);
        }
        if (e.target.name === 'status') {
            setData({ ...data, status: e.target.value });
            const temp = myRequestsProps.filter((request) => {
                if (((e.target.value == 'opened' && !isClosed(request)) || (e.target.value == 'closed' && isClosed(request)) || e.target.value == 'all') && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && (request.state.trim() == data.state.trim() || data.state.trim() == '') && (request.district.trim() == data.district.trim() || data.district.trim() == '') && (request.pin.trim() == data.pin.trim() || data.pin.trim() == '')) {
                    return request;
                }
            })
            setMyRequests(temp);
        }
    }

    const clearState = () => {
        document.getElementById('stateMyR').value = '';
        document.getElementById('districtMyR').innerHTML = '<option value="" class="hidden">--select district--</option>';
        document.getElementById('cityMyR').innerHTML = '<option value="" class="hidden">--select city--</option>';
        document.getElementById('pinMyR').innerHTML = '<option value="" class="hidden">--select pincode--</option>';
        setData({ ...data, state: '', district: '', city: '', pin: '' });
        const temp = myRequestsProps.filter((request) => {
            if ((request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all')) {
                return request;
            }
        })
        setMyRequests(temp);
    };

    const clearDistrict = () => {
        document.getElementById('districtMyR').value = '';
        document.getElementById('cityMyR').innerHTML = '<option value="" class="hidden">--select city--</option>';
        document.getElementById('pinMyR').innerHTML = '<option value="" class="hidden">--select pincode--</option>';
        setData({ ...data, district: '', city: '', pin: '' });
        const temp = myRequestsProps.filter((request) => {
            return (request.state.trim() == data.state.trim() && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all'));
        })
        setMyRequests(temp);
    };

    const clearCity = () => {
        document.getElementById('pinMyR').value = '';
        setData({ ...data, city: '', pin: '' });
        document.getElementById('cityMyR').innerHTML = `<option value="" class="hidden">--select city--</option>`;
        for (let state in props.data) {
            if (state == data.state) {
                for (let district in props.data[state]) {
                    if (district == data.district) {
                        for (let city in props.data[state][district]) {
                            let option = document.createElement("option");
                            option.innerHTML = `${city}`;
                            option.setAttribute("value", `${city}`);
                            option.setAttribute("class", 'text-gray-800');
                            document.getElementById("cityMyR").appendChild(option);
                        }
                    }
                }
            }
        }
        const temp = myRequestsProps.filter((request) => {
            if (request.state.trim() == data.state.trim() && request.district.trim() == data.district.trim() && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all')) {
                return request;
            }
        })
        setMyRequests(temp);
    };

    const clearPin = () => {
        document.getElementById('pinMyR').value = '';
        setData({ ...data, pin: '' });
        document.getElementById('cityMyR').innerHTML = `<option value="" class="hidden">--select city--</option>`;
        for (let state in props.data) {
            if (state == data.state) {
                for (let district in props.data[state]) {
                    if (district == data.district) {
                        for (let city in props.data[state][district]) {
                            let option = document.createElement("option");
                            option.innerHTML = `${city}`;
                            option.setAttribute("value", `${city}`);
                            option.setAttribute("class", 'text-gray-800');
                            document.getElementById("cityMyR").appendChild(option);
                        }
                    }
                }
            }
        }
        const temp = myRequestsProps.filter((request) => {
            if (request.state.trim() == data.state.trim() && request.district.trim() == data.district.trim() && (request.bloodGroup.trim() == data.bloodGroup.trim() || request.bloodGroup.trim().toLowerCase() == 'any' || data.bloodGroup.trim() == 'all') && ((data.status == 'opened' && !isClosed(request)) || (data.status == 'closed' && isClosed(request)) || data.status == 'all')) {
                return request;
            }
        })
        setMyRequests(temp);
    };

    const isClosed = (request) => {
        let c = new Date();
        let d = new Date(request.deadline);
        let year = d.getFullYear() - c.getFullYear();
        let month = d.getMonth() - c.getMonth();
        let day = d.getDate() - c.getDate();
        if (year > 0) {
            return request.isClosed;
        } else if (year == 0) {
            if (month > 0) {
                return request.isClosed;
            } else if (month == 0) {
                if (day >= 0) {
                    return request.isClosed;
                } else { return true; }
            } else { return true; }
        } else { return true; }
    };

    return (
        <div className='relative w-[80%] mini:w-full flex overflow-auto'>
            <div className={`flex flex-col gap-4 items-center h-screen w-full overflow-auto`}>
                <LoadingBar
                    color='#b9003a'
                    progress={progress}
                    height={4}
                    onLoaderFinished={() => setProgress(0)}
                />
                <p className='hidden mini:block text-lg text-white italic pt-8 px-4'>My Requests</p>
                <div className="flex gap-4 w-full justify-center flex-wrap p-4 pt-8 mini:pt-4">
                    <div className='flex w-[12rem]'>
                        <select name="state" onChange={change} id="stateMyR" title='Center State' className='w-full h-[2rem] rounded-md bg-transparent text-white border-2 border-solid border-gray-500 outline-none border-r-0 rounded-r-none' required>
                        </select>
                        <button title='Clear State' onClick={clearState} className='h-[2rem] px-2 rounded-md bg-transparent text-white text-base border-2 border-solid border-gray-500 outline-none border-l-0 rounded-l-none'>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className='flex w-[12rem]'>
                        <select name="district" onChange={change} id="districtMyR" title='Center District' className='w-full h-[2rem] rounded-md bg-transparent text-white border-2 border-solid border-gray-500 outline-none border-r-0 rounded-r-none' required>
                        </select>
                        <button title='Clear District' onClick={clearDistrict} className='h-[2rem] px-2 rounded-md bg-transparent text-white text-base border-2 border-solid border-gray-500 outline-none border-l-0 rounded-l-none'>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className='flex w-[12rem]'>
                        <select name="city" onChange={change} id="cityMyR" title='Center City' className='w-full h-[2rem] rounded-md bg-transparent text-white border-2 border-solid border-gray-500 outline-none border-r-0 rounded-r-none' required>
                        </select>
                        <button title='Clear City' onClick={clearCity} className='h-[2rem] px-2 rounded-md bg-transparent text-white text-base border-2 border-solid border-gray-500 outline-none border-l-0 rounded-l-none'>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className='flex w-[12rem]'>
                        <select name="pin" onChange={change} id="pinMyR" title='Center Pincode' className='w-full h-[2rem] rounded-md bg-transparent text-white border-2 border-solid border-gray-500 outline-none border-r-0 rounded-r-none' required>
                        </select>
                        <button title='Clear Pincode' onClick={clearPin} className='h-[2rem] px-2 rounded-md bg-transparent text-white text-base border-2 border-solid border-gray-500 outline-none border-l-0 rounded-l-none'>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className='flex w-[12rem]'>
                        <select title='Required Blood Group' name="bloodGroup" value={data.bloodGroup} onChange={change} className='w-full h-[2rem] rounded-md bg-transparent text-white border-2 border-solid border-gray-500 outline-none' required>
                            <option value="all" className='text-gray-800'>All Blood Groups</option>
                            <option value="A+" className='text-gray-800'>A+</option>
                            <option value="B+" className='text-gray-800'>B+</option>
                            <option value="O+" className='text-gray-800'>O+</option>
                            <option value="AB+" className='text-gray-800'>AB+</option>
                            <option value="A-" className='text-gray-800'>A-</option>
                            <option value="B-" className='text-gray-800'>B-</option>
                            <option value="O-" className='text-gray-800'>O-</option>
                            <option value="AB-" className='text-gray-800'>AB-</option>
                        </select>
                    </div>
                    <div className='flex w-[12rem]'>
                        <select title='Request Activation Status' name="status" value={data.status} onChange={change} className='w-full h-[2rem] rounded-md bg-transparent text-white border-2 border-solid border-gray-500 outline-none' required>
                            <option value="all" className='text-gray-800'>All Requests</option>
                            <option value="opened" className='text-gray-800'>Opened</option>
                            <option value="closed" className='text-gray-800'>Closed</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-wrap gap-4 p-4 justify-center w-full'>
                    {
                        myRequests?.length > 0 ? (
                            myRequests.map((request, index) => (
                                <MyRequest key={index} request={request} setAcceptors={setAcceptors} setIsSliderOpened={setIsSliderOpened} setProgress={setProgress} myRequests={myRequests} setMyRequests={setMyRequests} myRequestsProps={myRequestsProps} setMyRequestsProps={setMyRequestsProps} />
                            ))
                        ) : (
                            <div className="text-white p-4 text-center micro:text-sm">
                                No Previous Requests Found
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={`flex flex-col h-screen overflow-hidden absolute bg-[#161618] ${isSliderOpened ? 'w-full' : 'w-0'} border-r border-gray-800 transition-all ease-linear duration-250 z-20`}>
                <button title='Close Slider' onClick={() => setIsSliderOpened(false)} className='text-red-600 py-4 px-8 text-2xl text-right'>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className='flex flex-wrap w-full overflow-auto justify-center items-center p-4 gap-4'>
                    {
                        acceptors?.length > 0 ? (
                            acceptors.map((acceptor, index) => (
                                <div key={index} className="p-4 w-[20rem] nano:w-[14rem] h-[164px] bg-[#1c1c1f] shadow-lg shadow-black flex flex-col gap-2 justify-between rounded-lg">
                                    <div className="flex w-full justify-between">
                                        <p className='text-white text-sm'>{acceptor.name}</p>
                                        <p className="text-red-500 text-sm">{acceptor.blooodGroup}</p>
                                    </div>
                                    <div className='flex flex-col text-gray-400 text-xs break-all'>
                                        <span>{acceptor.phoneNumber}</span>
                                        <span>{acceptor.email}</span>
                                    </div>
                                    <div className='text-xs text-gray-400'>
                                        {acceptor.city}, {acceptor.district}, {acceptor.state}, {acceptor.pin}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-white p-4 text-center">
                                No Acceptors Found
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchPosts;