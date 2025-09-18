import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview'; //지도
import * as FileSystem from 'expo-file-system'; //마커 png
import { Asset } from 'expo-asset';  //마커 png

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

import { Mission, MissionStatus } from '@/types/mission';

import BackIcon from '@/assets/icon/arrow/back_arrow.svg';
import { useNavigation } from '@react-navigation/native';

const KAKAO_JS_KEY = (process.env.EXPO_PUBLIC_KAKAO_JS_KEY as string) || 'YOUR_KAKAO_JAVASCRIPT_KEY';

const makeHtml = (
  appKey: string,
  missionsJson: string,
  pinDataUrl: string,
  pinW: number, pinH: number,
  tipDy: number,
  badgePad: { x: number; y: number },
  calloutGap: number
) => `<!doctype html><html><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
<style>
  html,body,#map{height:100%;margin:0;padding:0}
  .badge{
    width:23px;height:23px;padding:0;
    display:flex;align-items:center;justify-content:center;
    background:#FFA54C;color:#fff;font-weight:700;font-size:13px;
    border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.25)
  }
  .callout{
    max-width:240px;background:#fff;border-radius:14px;
    padding:12px 40px 12px 12px;
    box-shadow:0 6px 18px rgba(0,0,0,.18);
    font-family:-apple-system,Roboto,'Noto Sans KR',sans-serif;color:#111
  }
  .time{ color:#9AA1A9;font-size:12px;margin-bottom:2px }
  .title{ font-size:14px;font-weight:600; }
</style>
<script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false"></script>
</head>
<body>
<div id="map"></div>
<script>
  function post(type, extra){ try{
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({type}, extra||{})));
  }catch(e){} }
  post('BOOT');

  window.onerror = function(message, source, lineno, colno){
    post('ERROR', { message:String(message), source, lineno, colno });
  };

  // '오전/오후' 접두사만 붙이고 24시간 표기 유지
  function ampmPrefix(timeStr){
    if(!timeStr) return '';
    var h = parseInt(timeStr.split(':')[0],10);
    if(isNaN(h)) return timeStr;
    return (h>=12?'오후 ':'오전 ')+timeStr;
  }

  var MISSIONS = ${missionsJson};
  var completed = MISSIONS.filter(function(m){ return m && m.status==='COMPLETED' && m.location; });
  function keyOf(lat,lng){ return lat.toFixed(5)+','+lng.toFixed(5); }
  var groups = {};
  completed.forEach(function(m){
    var k = keyOf(m.location.lat,m.location.lng);
    (groups[k]||(groups[k]={lat:m.location.lat,lng:m.location.lng,items:[]})).items.push(m);
  });

  kakao.maps.load(function(){
    var center = completed.length
      ? new kakao.maps.LatLng(completed[0].location.lat, completed[0].location.lng)
      : new kakao.maps.LatLng(37.5665,126.9780);

    var map = new kakao.maps.Map(document.getElementById('map'), { center:center, level:4 });

    // zIndex: 배지/말풍선은 시각적으로 위에 보이지만, 클릭은 우리 의도대로 처리
    var Z_MARKER = 400;
    var Z_BADGE  = 500;
    var Z_CALLOUT= 600;

    var PIN_URL='${pinDataUrl}', pinW=${pinW}, pinH=${pinH}, tipDy=${tipDy};
    var useCustomPin = !!PIN_URL;

    var idx = 0;
    Object.keys(groups).forEach(function(key){
      var g = groups[key];
      var pos = new kakao.maps.LatLng(g.lat,g.lng);

      // 마커
      var markerOpts = { position: pos, clickable: true, zIndex: Z_MARKER };
      if (useCustomPin) {
        markerOpts.image = new kakao.maps.MarkerImage(
          PIN_URL,
          new kakao.maps.Size(pinW,pinH),
          { offset: new kakao.maps.Point(Math.round(pinW/2), pinH - tipDy) }
        );
      }
      var marker = new kakao.maps.Marker(markerOpts);
      marker.setMap(map);

      // 배지: 좌상단(터치 방해 금지)
      var badgeOffsetX = -Math.round(pinW/2) + ${badgePad.x};
      var badgeOffsetY = -pinH + ${badgePad.y};
      var count = g.items.length;
      var label = (count>99)?'99+':String(count);
      var fs = (label.length>=3)?10:13;
      var badge = new kakao.maps.CustomOverlay({
        position: pos, xAnchor: 0.5, yAnchor: 1.0, zIndex: Z_BADGE,
        content:
          '<div style="transform:translate('+badgeOffsetX+'px,'+badgeOffsetY+'px);pointer-events:none">'+
            '<div class="badge" style="font-size:'+fs+'px">'+label+'</div>'+
          '</div>'
      });
      badge.setMap(map);

      // 말풍선: 마커 클릭 -> OPEN -> 말풍선 클릭 → CLOSE
      var calloutOffsetY = pinH + ${calloutGap};
      var coId = 'co_' + (idx++);
      var html = '<div id="'+coId+'" class="callout" '+'style="pointer-events:auto; transform:translateY(-'+calloutOffsetY+'px)">';
      g.items.slice(0,3).forEach(function(m){
        html += '<div class="time">'+ ampmPrefix(m.mission_start_time) +'</div>';
        html += '<div class="title">'+ m.title +'</div>';
      });
      html += '</div>';

      var callout = new kakao.maps.CustomOverlay({
        position: pos, xAnchor: 0.5, yAnchor: 1.0, zIndex: Z_CALLOUT, content: html
      });

      // 토글 상태(마커별 독립)
      var opened = false;
      kakao.maps.event.addListener(marker, 'click', function(){
        opened = !opened;
        callout.setMap(opened ? map : null);
        post('TOGGLE', { opened: opened, lat: g.lat, lng: g.lng });

        //토글 OPEN일 때 : 말풍선 본문 클릭하면 닫히도록 리스너 부착
        if (opened) {
          setTimeout(function(){
            var el = document.getElementById(coId);
            if (el) {
              el.onclick = function(ev){
                ev.preventDefault(); ev.stopPropagation();
                opened = false;
                callout.setMap(null);
                post('CALLOUT_CLOSE', { lat: g.lat, lng: g.lng });
              };
            }
          }, 0);
        }
      });
    });

    post('MAP_READY', { groups: Object.keys(groups).length, useCustomPin: useCustomPin });
  });
</script>
</body>
</html>`;


//임의 미션 데이터 값
const missionList: Mission[] = [
  {
    id: BigInt(1),
    title: '마트가기',
    description: '마트가기의 상세설명입니다...',
    requires_photo: true,
    mission_start_time: '09:00',
    mission_end_time: '10:00',
    status: 'COMPLETED',
    location: { lat: 37.5665, lng: 126.9780 }
  },
  {
    id: BigInt(2),
    title: '집 청소하기',
    description: '집 청소하기의 상세설명입니다...',
    requires_photo: false,
    mission_start_time: '10:00',
    mission_end_time: '11:00',
    status: 'COMPLETED',
    location: { lat: 37.5665, lng: 126.9780 }
  },
  {
    id: BigInt(3),
    title: '공부하기',
    description: '공부하기의 상세설명입니다.',
    requires_photo: true,
    mission_start_time: '15:00',
    mission_end_time: '18:00',
    status: 'COMPLETED',
    location: { lat: 37.5656, lng: 126.9769 },
  },
];

const Map = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const missionsForWeb = missionList.map(m => ({ ...m, id: m.id.toString() }));
  const missionsJson = useMemo(() => {
    const raw = JSON.stringify(missionsForWeb);
    return raw.replace(/<\/script>/g, '<\\/script>'); 
  }, []);

  //로컬 PNG -> data URL
  const [pinDataUrl, setPinDataUrl] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(require('@/assets/icon/position.png'));
      await asset.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(asset.localUri!, { encoding: FileSystem.EncodingType.Base64 });
      setPinDataUrl(`data:image/png;base64,${base64}`);
    })();
  }, []);

  //마커 지정 크기들
  const PIN_W = 61;
  const PIN_H = 85;
  const TIP_DY = 0;     // 바늘 끝이 이미지 맨 아래면 0, 위에 있으면 +값으로(예: 6)
  const BADGE_PAD = { x: 13, y: 13 }; // 좌상단에서 안쪽으로 살짝
  const CALLOUT_GAP = 15;

  const source = useMemo(() => {
    if (!pinDataUrl) return undefined;
    return {
      html: makeHtml(KAKAO_JS_KEY, missionsJson, pinDataUrl || '', 
        PIN_W, PIN_H, TIP_DY, BADGE_PAD, CALLOUT_GAP),
      baseUrl: 'http://localhost',
    };
  }, [missionsJson, pinDataUrl]);

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>루틴지도</Text>
      </View>
      {/* 지도 */}
      <View style={styles.mapWrap}>
        {source ? (
          <WebView
            source={source}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            onMessage={(e) => {
              try {
                const msg = JSON.parse(e.nativeEvent.data);
                if (msg.type === 'ERROR') console.warn('[WEB ERROR]', msg);
                else console.log('[WEB]', msg);
              } catch {
                console.log('[WEB RAW]', e.nativeEvent.data);
              }
            }}
            onLoadStart={() => console.log('WV onLoadStart')}
            onLoad={() => console.log('WV onLoad')}
            onError={(s) => console.warn('WV onError', s.nativeEvent)}
            onHttpError={(s) => console.warn('WV onHttpError', s.nativeEvent)}
          />
        ) : (
          <View style={styles.loader}><ActivityIndicator /></View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text: {
    color: '#000000', 
    fontSize: 24,
  },
// 헤더 스타일
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight : 12,
  },
  headerTitle: {
    ...Typo.heading04,
    color : Colors.gray800,
  },
  mapWrap: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default Map;
