import { createClient } from '@usewaypoint/client'
import dotenv from 'dotenv'
dotenv.config()

export const sendEmail = async (template, email) => {
  let templateId
  switch (template) {
    case 'login':
      templateId = 'wptemplate_gSCGmQzcEySQrBmN'
      break
    case 'update-profile':
      templateId = 'wptemplate_KLBiYB5NLhyUGZJr'
      break
    case 'new-task':
      templateId = 'wptemplate_MyFA9u7LkAgLbxQb'
      break
    default:
      templateId = 'wptemplate_gSCGmQzcEySQrBmN'
      break
  }

  const client = createClient(
    process.env.WAYPOINT_USN,
    process.env.WAYPOINT_PSW
  )

  console.log(email)

  const emailList = Array.isArray(email) ? email : [email]

  console.log(emailList)

  for (const email of emailList) {
    await client.emailMessages.createTemplated({
      templateId: templateId,
      to: email,
    })
  }
}
