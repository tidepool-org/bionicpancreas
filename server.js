var express = require('express')
var expressLess = require('express-less');
var engine = require('ejs-locals');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use('/css', expressLess(__dirname + '/less', { debug: true }));

app.get('/bgEntry', function(req, res) {
  res.sendfile(__dirname + '/assets/html/bgEntry.html');
});

app.get('/remote', function(req, res) {
  res.sendfile(__dirname + '/assets/html/remote.html');
});

app.get('/list', function(req, res) {
  res.sendfile(__dirname + '/assets/html/list.html');
});

app.get('/levels/offline', function(req, res) {
  res.send({"battery":50,"cgmLife":5,"calibration":420,"insulin":50,"glucagon":60,"oclusion":0,"cgmTransmitterBatteryLow":0,"cgmOffline":0,"infusionSite":3});
});

var levels = {
  battery: 50,
  cgmLife: 5,
  calibration: 420,
  insulin: 50,
  glucagon: 60,
  oclusion: 0,
  cgmTransmitterBatteryLow: 0,
  cgmOffline: 0,
  infusionSite: 3
};

app.get('/levels', function(req, res) {
  res.send(levels);
});

app.get('/remoteControl', function(req, res) {
  console.log('req.query', req.query);

  if (req.query.levels) {
    qlevels = JSON.parse(req.query.levels);

    levels = {
      battery: parseInt(qlevels.battery),
      cgmLife: parseInt(qlevels.cgmLife),
      calibration: parseInt(qlevels.calibration),
      insulin: parseInt(qlevels.insulin),
      glucagon: parseInt(qlevels.glucagon),
      oclusion: parseInt(qlevels.oclusion),
      cgmTransmitterBatteryLow: parseInt(qlevels.cgmTransmitterBatteryLow),
      cgmOffline: parseInt(qlevels.cgmOffline),
      infusionSite: parseInt(qlevels.infusionSite),
    }
  }

  res.send({ok:1});
});

app.use('/assets', express.static(__dirname + '/assets'));

app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));

app.get('/cgm/start', function(req, res) {
  res.render('cgm', {
    backHref: '/menu',
    topbarIconClass: 'cgmTitleIcon',
    topbarTitle: 'CGM',
    circleButtonText: 'start',
    circleButtonHref: '/cgm/stop'
  });
});

app.get('/cgm/stop', function(req, res) {
  res.render('cgm', {
    backHref: '/menu',
    topbarIconClass: 'cgmTitleIcon',
    topbarTitle: 'CGM',
    circleButtonText: 'stop',
    circleButtonHref: '/cgm/sure'
  });
});

app.get('/cgm/sure', function(req, res) {
  res.render('cgmSure', {
    backHref: 'javascript:history.back()',
    topbarIconClass: 'cgmTitleIcon',
    topbarTitle: 'CGM'
  });
});

app.get('/cgm/transmitter', function(req, res) {
  res.render('transmitter', {
    backHref: 'javascript:history.back()',
    topbarIconClass: 'cgmTitleIcon',
    topbarTitle: 'Transmitter',
    bottombarTitle: 'done',
    bottombarClass: 'disabled',
    bottomHref: 'javascript:history.back()'
  });
});

app.get('/infusionSite', function(req, res) {
  res.render('infusionSite', {
    backHref: '/menu',
    topbarTitle: 'Infusion Site',
    topbarIconClass: 'infusionSetTitleIcon',
    circleButtonText: 'fill',
    circleButtonHref: '/infusionSite/fill',
    circleInstructions: 'insert new infusion site and connect tubing before pressing fill'
  });
});

app.get('/infusionSite/fill', function(req, res) {
  res.render('infusionSiteFilling', {
    backHref: '/infusionSite',
    topbarIconClass: 'infusionSetTitleIcon',
    topbarTitle: 'Infusion Site'
  });
});

app.get('/insulin', function(req, res) {
  res.render('insulin', {
    backHref: '/menu',
    topbarTitle: 'Insulin',
    topbarIconClass: 'insulinTitleIcon',
    circleButtonText: 'start',
    circleButtonHref: '/insulin/steps',
    circleInstructions: 'disconnect from body & prepare new cartridge'
  });
});


app.get('/insulin/steps', function(req, res) {
  res.render('insulinSteps', {
    backHref: '/insulin',
    topbarTitle: 'Insulin',
    topbarIconClass: 'insulinTitleIcon',
    bottombarTitle: 'done',
    bottombarClass: 'disabled',
    bottomHref: '/'
  });
});

app.get('/glucagon', function(req, res) {
  res.render('glucagon', {
    backHref: '/menu',
    topbarTitle: 'Glucagon',
    topbarIconClass: 'glucagonTitleIcon',
    circleButtonText: 'start',
    circleButtonHref: '/glucagon/steps',
    circleInstructions: 'disconnect from body & prepare new cartridge'
  });
});

app.get('/glucagon/steps', function(req, res) {
  res.render('glucagonSteps', {
    backHref: '/glucagon',
    topbarIconClass: 'glucagonTitleIcon',
    topbarTitle: 'Glucagon',
    bottombarTitle: 'done',
    bottombarClass: 'disabled',
    bottomHref: '/'
  });
});

app.get('/gburst', function(req, res) {
  res.render('gburst', {
    backHref: '/',
    topbarTitle: 'G Burst',
    topbarIconClass: 'gburstTitleIcon',
    bottombarTitle: 'deliver',
    bottombarClass: 'disabled',
    bottomHref: 'javascript:deliver()'
  });
});

app.get('/carb', function(req, res) {
  res.render('carb', {
    backHref: '/',
    topbarTitle: 'Carb Entry',
    topbarIconClass: 'carbWhite',
    bottombarTitle: 'deliver',
    bottombarClass: 'disabled',
    bottomHref: 'javascript:deliver()'
  });
});

app.get('/carb/deliver', function(req, res) {
  res.render('carbDelivering', {
    backHref: '/carb',
    topbarIconClass: 'carbWhite',
    topbarTitle: 'Carb entry'
  });
});

app.get('/cannula', function(req, res) {
  res.render('cannula', {
    backHref: '/settings',
    topbarIconClass: 'cannulaLengthTitleIcon',
    topbarTitle: 'Cannula'
  });
});

app.get('/sound', function(req, res) {
  res.render('sound', {
    backHref: '/alerts',
    topbarIconClass: 'volumeTitleIcon',
    topbarTitle: 'Sound'
  });
});

app.get('/display', function(req, res) {
  res.render('display', {
    backHref: '/settings',
    topbarIconClass: 'fontTitleIcon',
    topbarTitle: 'Display'
  });
});

app.get('/childlock', function(req, res) {
  res.render('childlock', {
    backHref: '/settings',
    topbarIconClass: 'childlockTitleIcon',
    topbarTitle: 'Child lock'
  });
});

app.get('/units', function(req, res) {
  res.render('units', {
    backHref: '/settings',
    topbarIconClass: 'unitsTitleIcon',
    topbarTitle: 'Units'
  });
});

app.get('/language', function(req, res) {
  res.render('langs', {
    backHref: '/settings',
    topbarIconClass: 'languageTitleIcon',
    topbarTitle: 'Language'
  });
});

app.get('/weight', function(req, res) {
  res.render('weight', {
    backHref: '/menu',
    topbarTitle: 'Weight',
    topbarIconClass: 'weightTitleIcon',
    bottombarTitle: 'update',
    bottombarClass: '',
    bottomHref: 'javascript:edit()'
  });
});

app.get('/weight/enter', function(req, res) {
  res.render('weightEntry', {
    backHref: '/weight',
    topbarTitle: 'Weight',
    topbarIconClass: 'weightTitleIcon',
    bottombarTitle: 'save',
    bottombarClass: '',
    bottomHref: '/weight'
  });
});

app.get('/phone', function(req, res) {
  res.render('phone', {
    backHref: '/settings',
    topbarIconClass: 'phoneTitleIcon',
    topbarTitle: 'Phone'
  });
});

app.get('/phone/code', function(req, res) {
  res.render('phoneCode', {
    backHref: '/settings',
    topbarIconClass: 'phoneTitleIcon',
    topbarTitle: 'Phone'
  });
});

app.get('/phone/disconnect', function(req, res) {
  res.render('phoneDisconnect', {
    backHref: '/settings',
    topbarIconClass: 'phoneTitleIcon',
    topbarTitle: 'Phone'
  });
});

app.get('/bgm', function(req, res) {
  res.render('bgm', {
    backHref: '/settings',
    topbarIconClass: 'bgmTitleIcon',
    topbarTitle: 'BG Meter'
  });
});

app.get('/bgm/id', function(req, res) {
  res.render('bgmid', {
    backHref: '/settings',
    topbarIconClass: 'bgmTitleIcon',
    topbarTitle: 'BG Meter',
    bottombarTitle: 'done',
    bottombarClass: '',
    bottomHref: '/bgm/list'
  });
});

app.get('/bgm/list', function(req, res) {
  res.render('bgList', {
    backHref: '/settings',
    topbarIconClass: 'bgmTitleIcon',
    topbarTitle: 'BG Meter'
  });
});

app.get('/bgm/disconnect', function(req, res) {
  res.render('bgmdisconnect', {
    backHref: '/settings',
    topbarIconClass: 'bgmTitleIcon',
    topbarTitle: 'BG Meter'
  });
});

app.get('/status', function(req, res) {
  res.render('status', {
    backHref: '/',
    topbarIconClass: 'statusTitleIcon',
    topbarTitle: 'Status'
  });
});

app.get('/', function(req, res) {
  res.render('home2');
});

app.get('/datetime', function(req, res) {
  res.render('datetime', {
    backHref: '/settings',
    topbarIconClass: 'dateTimeTitleIcon ',
    topbarTitle: 'Date & time'
  });
});

app.get('/lowAlerts', function(req, res) {
  res.render('lowAlerts', {
    backHref: '/alerts',
    startBgValue: 80,
    startTimeValue: 5,
    topbarIconClass: 'lowAlertTitleIcon',
    topbarTitle: 'Low alerts'
  });
});

app.get('/highAlerts', function(req, res) {
  res.render('highAlerts', {
    backHref: '/alerts',
    startBgValue: 180,
    startTimeValue: 30,
    topbarIconClass: 'highAlertTitleIcon',
    topbarTitle: 'High alerts'
  });
});

app.get('/bg', function(req, res) {
  res.render('bg', {
    backHref: '/',
    topbarIconClass: 'bgTitleIcon',
    topbarTitle: 'BG entry',
    bottombarTitle: 'done',
    bottombarClass: 'disabled',
    bottomHref: 'javascript:showEntry()'
  });
});

app.get('/lock', function(req, res) {
  res.render('lock');
});
app.get('/locktest', function(req, res) {
  res.render('locktest');
});

app.get('/splash', function(req, res) {
  res.render('splash');
});

app.get('/alerts/occlusion', function(req, res) {
  res.render('alertTemplate', {alertImage: 'occlusionAlert.svg'});
});
app.get('/alerts/batteryDead', function(req, res) {
  res.render('alertTemplate', {alertImage: 'deadBatteryAlarm.svg'});
});
app.get('/alerts/battery', function(req, res) {
  res.render('alertTemplate', {alertImage: 'batteryAlert.svg'});
});
app.get('/alerts/calibration', function(req, res) {
  res.render('alertTemplate', {alertImage: 'bgAlert.svg', alertActionHref: '/bg'});
});
app.get('/alerts/insulin', function(req, res) {
  res.render('alertTemplate', {alertImage: 'noInsulinAlert.svg', alertActionHref: '/insulin'});
});
app.get('/alerts/glucagon', function(req, res) {
  res.render('alertTemplate', {alertImage: 'noGlucagonAlert.svg', alertActionHref: '/glucagon'});
});
app.get('/alerts/transmitterlow', function(req, res) {
  res.render('alertTemplate', {alertImage: 'cgmTransmitterAlert.svg'});
});

app.get('/history', function(req, res) {
  res.render('history', {
    backHref: '/menu',
    topbarIconClass: 'historyTitleIcon',
    topbarTitle: 'History'
  });
});

app.get('/adjust', function(req, res) {
  res.render('adjust', {
    backHref: '/',
    topbarIconClass: 'adjustTitleIcon',
    topbarTitle: 'Adjust'
  });
});

app.get('/menu', function(req, res) {
  res.render('menu', {
    backHref: '/',
    menubarTitle: 'Menu'
  });
});

app.get('/alerts', function(req, res) {
  res.render('alerts', {
    backHref: '/menu',
    menubarTitle: 'Alerts'
  });
});

app.get('/info', function(req, res) {
  res.render('info', {
    backHref: '/menu',
    menubarTitle: 'Info'
  });
});

app.get('/settings', function(req, res) {
  res.render('settings', {
    backHref: '/menu',
    menubarTitle: 'Settings'
  });
});

app.get('/stats', function(req, res) {
  res.render('stats', {
    backHref: '/menu',
    topbarIconClass: 'statsTitleIcon',
    topbarTitle: 'Stats'
  });
});

app.get('/weight/remind', function(req, res) {
  res.render('weightRemind', {
    backHref: '/weight',
    topbarIconClass: 'weightTitleIcon',
    topbarTitle: 'Weight'
  });
});


http.listen(8087, function () {
  console.log('listening on *:8087');
});

io.on('connection', function(socket){
  socket.on('screenUpdate', function (data) {
    console.log(data);
    io.sockets.emit('screen',data);
  });
});
