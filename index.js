const express = require('express');
const mqtt = require('mqtt')
const fs = require('fs')
const cors = require('cors');
const { Command } = require('commander')

const program = new Command()

const serverport = 2021;

const app = express();
app.use(cors({
  origin: '*'
}));

app.use(cors({
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.listen(serverport, ()=>{
    console.log(`Server is listening on port ${serverport}`)
});



program
  .option('-p, --protocol <type>', 'connect protocol: mqtt, mqtts, ws, wss. default is mqtt', 'mqtt')
  .parse(process.argv)

const host = 'Your Host Address'
const port = 'Port'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

// connect options
const OPTIONS = {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'User Name',
  password: 'Password',
  reconnectPeriod: 1000,
}
// protocol list
const PROTOCOLS = ['mqtt', 'mqtts', 'ws', 'wss']

// default is mqtt, unencrypted tcp connection
// let connectUrl = `ws://${host}:${port}`
let connectUrl = `mqtt://${host}:${port}`
if (program.protocol && PROTOCOLS.indexOf(program.protocol) === -1) {
  console.log('protocol must one of mqtt, mqtts, ws, wss.')
} else if (program.protocol === 'mqtts') {
  // mqtts， encrypted tcp connection
  connectUrl = `mqtts://${host}:8883`
} else if (program.protocol === 'ws') {
  // ws, unencrypted WebSocket connection
  const mountPath = '/mqtt' // mount path, connect emqx via WebSocket
  connectUrl = `ws://${host}:8083${mountPath}`
} else if (program.protocol === 'wss') {
  // wss, encrypted WebSocket connection
  const mountPath = '/mqtt' // mount path, connect emqx via WebSocket
  connectUrl = `wss://${host}:8084${mountPath}`
  
} else {}

const topic = 'Topic Name'
console.log(connectUrl);
const client = mqtt.connect(connectUrl, OPTIONS)

client.on('connect', () => {
  console.log(`${program.protocol}: Connected`)
  client.subscribe([topic], () => {
    console.log(`${program.protocol}: Subscribe to topic '${topic}'`)
  })
})

client.on('reconnect', (error) => {
  console.log(`Reconnecting(${program.protocol}):`, error)
})

client.on('error', (error) => {
  console.log(`Cannot connect(${program.protocol}):`, error)
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})

var commandsObject = new Object();
commandsObject["power_on"] = "{'a':1}";
commandsObject["power_off"] = "{'a':3}";
commandsObject["clear_single_riding_mileage"] = "{'a':5}";
commandsObject["clear_single_riding_time"] = "{'a':7}";
commandsObject["clear_total_mileage"] = "{'a':9}";
commandsObject["clear_total_riding_time"] = "{'a':11}";
commandsObject["set_speed_limit_data"] = "{'a':3}";
commandsObject["query_vehicle_param"] = "{'a':15}";
commandsObject["query_gps_location_data"] = "{'a':18}";
commandsObject["reboot_IOT"] = "{'a':20}";
commandsObject["query_hardware_and_firmware_version"] = "{'a':21}";
commandsObject["start_upgrade_firmware"] = "{'a':23,'l':50}";
commandsObject["send_updating_data"] = "{'a':67,'x':55,'l':55,'d':012z}";
commandsObject["updating_success_report"] = "{'a':69,'i':'12AB','s':0}";
commandsObject["query_imei_number"] = "{'a':24}";
// commandsObject["vehiclestatusreport"] = "{'a':20}";
commandsObject["alarm_buzzer"] = "{'a':28}";
commandsObject["query_server_parameters"] = "{'a':35}";
commandsObject["lamp_switch_setting"] = "{'a':37,'d':0}";//d:0-off, 1-on
commandsObject["vibration_sensitivity_setting"] = "{'a':39,'v':0}";//0:vibration off, >0
commandsObject["kilometer_or_mile_switch_setting"] = "{'a':41,'f':0}";//0:kilo,1:mile
commandsObject["lamp_mode_setting"] = "{'a':43,'j':0}";//0:command control, 1:always on
commandsObject["apn_setting"] = "{'a':53,'z':AT+QICSGP=15,1,'apn','username','password',0}";
// commandsObject["scooter_status_param"] = "{'a':20}";
commandsObject["special_alarm_buzzer"] = "{'a':58,'v':5,'i':100,'L':200}";
commandsObject["battery_unlock"] = "{'a':60}";
commandsObject["battery_lock"] = "{'a':62}";
commandsObject["chainlock_unlock"] = "{'a':71}";
commandsObject["enter_pause_mode"] = "{'a':73}";
commandsObject["exit_pause_mode"] = "{'a':75}";
commandsObject["query_IOT_log"] = "{'a':77}";
commandsObject["query_status_of_chain_lock"] = "{'a':83}";
commandsObject["reboot_IOT_if_updated"] = "{'a':93}";
commandsObject["query_4g_signal_intensity"] = "{'a':97}";
commandsObject["set_server_parameters"] = "{'a':101,'u':ipaddress:1883:username:password}";


app.get('/control-vehicle', (req, res) => {
  client.publish(topic,commandsObject[req.query.title]);
  res.send('success')
})
