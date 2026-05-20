import { useEffect, useState } from "react";
import { UseAppData } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { riderService } from "../main";
import toast from "react-hot-toast";
import { BiUpload } from "react-icons/bi";

interface IRider {
    _id: string,
    phoneNumber: string;
    aadharNumber: string;
    drivingLicenseNumber: string;
    picture: string;
    isVerified: boolean;
    isAvailable: boolean;
}
const RiderDashboard = () => {

    const { user } = UseAppData();

    const { socket } = useSocket();

    const [profile, setProfile] = useState<IRider | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [toggling, setToggling] = useState<boolean>(false);

    const fetchProfile = async () => {

        try {
            const { data } = await axios.get(`${riderService}/api/rider/myprofile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            setProfile(data.account || null);


        } catch (error) {
            setProfile(null);


        } finally {
            setLoading(false);

        }
    }



    useEffect(() => {
        if (user?.role === "rider") fetchProfile();
        else setLoading(false);

    }, [user])

    const toggleAvailability = async () => {
        if (!navigator.geolocation) {
            toast.error("location access required ");
            return;
        }

        setToggling(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                await axios.patch(`${riderService}/api/rider/toggle`, {
                    isAvailable: !profile?.isAvailable,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });

                toast.success(profile?.isAvailable ? "You are offline" : "You are Online");
                fetchProfile();

            } catch (error: any) {
                toast.error(error.response.data.message);
            } finally {
                setToggling(false);
            }
        });
    };




    const [phoneNumber, setPhoneNumber] = useState("")
    const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("")
    const [aadharNumber, setAadharNumber] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)





    const handleSubmit = async () => {
        if (!phoneNumber || !drivingLicenseNumber || !aadharNumber || !image) {
            toast.error("Please fill all fields and upload an image");
            return;
        }

        if (!navigator.geolocation) {
            toast.error("Location access required");
            return;
        }

        setSubmitting(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const formData = new FormData();
                formData.append("phoneNumber", phoneNumber);
                formData.append("drivingLicenseNumber", drivingLicenseNumber);
                formData.append("aadharNumber", aadharNumber);
                formData.append("file", image);
                formData.append("latitude", String(pos.coords.latitude));
                formData.append("longitude", String(pos.coords.longitude));

                await axios.post(`${riderService}/api/rider/new`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                toast.success("Profile created successfully");
                fetchProfile();

            } catch (error: any) {
                toast.error(error.response?.data?.message || "Something went wrong");
            } finally {
                setSubmitting(false);
            }
        });
    };


    if (user?.role !== "rider") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                You are not a registered as a rider
            </div>

        )

    }


    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                Loading rider details .....
            </div>

        )
    }
    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-6">
                <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm space-y-5">
                    <h1 className="text-xl font-semibold ">Add your  Profile</h1>
                    <input type="number"
                        placeholder="Aadhar number "
                        value={aadharNumber}
                        onChange={(e) => setAadharNumber(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                    />
                    <input type="number"
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                    />
                    <input type="text"
                        placeholder="Driving License Number"
                        value={drivingLicenseNumber}
                        onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                    />

                    <label className="flex  cursor-pointer items-center  gap-3 rounded-lg border p-4 
                text-sm text-gray-600 hover:bg-gray-50" >
                        <BiUpload className="h-5 w-5 text-red-500" />
                        {image ? image.name : "Upload your  image"}
                        <input type="file"
                            accept="image/*"
                            hidden
                            onChange={e => setImage(e.target.files?.[0] || null)} />
                    </label>


                    <button className="w-full rounded-lg py-3 text-sm 
                font-semibold text-white bg-[#E23744]"
                        onClick={handleSubmit}
                        disabled={submitting}>
                        {
                            submitting ? "submitting ..." : "Add profile "
                        }
                    </button>



                </div>
            </div>

        )
    }
    return (
        <div className="space-y-4 ">
            <div className="mx-auto max-w-md px-4 py-4">
                <div className="rounded-xl bg-white p-4 shadow space-y-3">
                    <img src={profile.picture} className="mx-auto h-24 w-24 rounded-full object-cover" alt="" />

                    < p className="text-center font-semibold ">{user?.name}</p>

                    <p className="text-center text-sm text-gray-500">{profile.phoneNumber}</p>

                    <div className="flex justify-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                            {profile.isVerified ? "Verified" : "Pending"}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                            {profile.isAvailable ? "Online" : "Offline"}
                        </span>
                    </div>


                    <div >
                        <p className="text-blue-400">
                            Please be within a 500m radius of any restaurant (which we call a hotspot) before going  online as a rider to receive order.
                        </p>
                    </div>

                    {profile.isVerified && <button onClick={toggleAvailability} disabled={toggling}
                        className={`w-full py-2 rounded-lg text-white font-semibold ${toggling ? "bg-gray-400" : profile.isAvailable ? "bg-gray-600" : "bg-[#e23444]"

                            }`}>

                        {toggling ? "Updating..."
                            : profile.isAvailable
                                ? "Go offline" :
                                "Go online"

                        }

                    </button>}

                </div>


            </div>
        </div>
    )
}

export default RiderDashboard