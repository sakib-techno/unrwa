import { AuthUser } from "@/app/helper";
import { connectionStr } from "@/lib/db";
import { Mission } from "@/lib/model/mission";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(){
    let pendingMission;
    let completedMission;
    let rejectedMission;
    let totalMission;

    let todayPendingMission;
    let todayCompletedMission;
    let todayRejectedMission;
    let todayTotalMission;

    try{
        let userInfo = await AuthUser();
        let user_type = userInfo.user_type;
        let user_id = await userInfo.staff_id;
        console.log(connectionStr);
        await mongoose.connect(connectionStr);
        let currentDate = new Date().toJSON().slice(0, 10);
        //return NextResponse.json({user_id,success:true});
        pendingMission = await Mission.countDocuments({leader: user_id, request_status: "request_received" });

        completedMission = await Mission.countDocuments({leader: user_id, request_status: "mission_completed" });

        rejectedMission = await Mission.countDocuments({leader: user_id, cla_decision: "denied" });

        totalMission = await Mission.countDocuments({ leader: user_id });

        todayPendingMission = await Mission.countDocuments({leader: user_id, request_status: "request_received",create_date:currentDate });

        todayCompletedMission =  await Mission.countDocuments({leader: user_id, request_status: "mission_completed",completed_date:currentDate});
        todayRejectedMission = await Mission.countDocuments({leader: user_id, cla_decision: "denied",rejected_date:currentDate });

        todayTotalMission = await Mission.countDocuments({leader: user_id,create_date:currentDate});
    } catch(error) {
        //data={success:false,error:error.message};
    }

    return NextResponse.json({pendingMission,completedMission,rejectedMission,totalMission,todayTotalMission,todayCompletedMission,todayPendingMission,todayRejectedMission,success:true});
}