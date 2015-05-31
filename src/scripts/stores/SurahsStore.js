import BaseStore from 'fluxible/addons/BaseStore';
import debug from 'utils/Debug';

class SurahsStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);
    this.surahs = [];
    this.surah = {
      page: null,
      revelation: {
        order: null,
        place: null
      },
      name: {
        arabic: null,
        simple: null,
        complex: null,
        english: null
      },
      ayat: 0,
      bismillah_pre:
      false,
      id: 0
    };
    this.wikiLinks = {"1":"Al-Fatiha","2":"Al-Baqara","3":"Al Imran","4":"An-Nisa","5":"Al-Ma'ida","6":"Al-An'am","7":"Al-A'raf","8":"Al-Anfal","9":"At-Tawba","10":"Yunus (sura)","11":"Hud (sura)","12":"Yusuf (sura)","13":"Ar-Ra'd","14":"Ibrahim (sura)","15":"Al-Hijr (sura)","16":"An-Nahl","17":"Al-Isra","18":"Al-Kahf","19":"Maryam (sura)","20":"Ta-Ha","21":"Al-Anbiya","22":"Al-Hajj","23":"Al-Mu'minoon","24":"An-Nur","25":"Al-Furqan","26":"Ash-Shu'ara","27":"An-Naml","28":"Al-Qasas","29":"Al-Ankabut","30":"Ar-Rum","31":"Luqman (sura)","32":"As-Sajda","33":"Al-Ahzab","34":"Saba (sura)","35":"Fatir","36":"Ya Sin","37":"As-Saaffat","38":"Sad (sura)","39":"Az-Zumar","40":"Ghafir","41":"Fussilat","42":"Ash-Shura","43":"Az-Zukhruf","44":"Ad-Dukhan","45":"Al-Jathiya","46":"Al-Ahqaf","47":"Muhammad (sura)","48":"Al-Fath","49":"Al-Hujurat","50":"Qaf (sura)","51":"Adh-Dhariyat","52":"At-Tur","53":"An-Najm","54":"Al-Qamar","55":"Ar-Rahman","56":"Al-Waqi'a","57":"Al-Hadid","58":"Al-Mujadila","59":"Al-Hashr","60":"Al-Mumtahina","61":"As-Saff","62":"Al-Jumua","63":"Al-Munafiqun","64":"At-Taghabun","65":"At-Talaq","66":"At-Tahrim","67":"Al-Mulk","68":"Al-Qalam","69":"Al-Haaqqa","70":"Al-Maarij","71":"Nuh (sura)","72":"Al-Jinn","73":"Al-Muzzammil","74":"Al-Muddathir","75":"Al-Qiyama","76":"Al-Insan","77":"Al-Mursalat","78":"An-Naba","79":"An-Naziat","80":"Abasa","81":"At-Takwir","82":"Al-Infitar","83":"Al-Mutaffifin","84":"Al-Inshiqaq","85":"Al-Burooj","86":"At-Tariq","87":"Al-Ala","88":"Al-Ghashiyah","89":"Al-Fajr (sura)","90":"Al-Balad","91":"Ash-Shams","92":"Al-Lail","93":"Ad-Dhuha","94":"Al-Inshirah","95":"At-Tin","96":"Al-Alaq","97":"Al-Qadr (sura)","98":"Al-Bayyina","99":"Az-Zalzala","100":"Al-Adiyat","101":"Al-Qaria","102":"At-Takathur","103":"Al-Asr","104":"Al-Humaza","105":"Al-Fil","106":"Quraysh (sura)","107":"Al-Ma'un","108":"Al-Kawthar","109":"Al-Kafirun","110":"An-Nasr","111":"Al-Masadd","112":"Al-Ikhlas","113":"Al-Falaq","114":"Al-Nas"};
  }

  _surahsReceived(data) {
    debug('STORES-SURAHS RECEIVED');
    this.surahs = data.surahs;

    if (data.surah) {
      this.surah = this.surahs[data.surah - 1];
    }

    this.emitChange();
  }

  _currentSurahChange(payload, name) {
    debug('STORES-CURRENT SURAH');
    if (this.dispatcher.getStore('RouteStore')._currentRoute.get('name') === 'surah') {
      this.surah = this.surahs[this.dispatcher.getStore('RouteStore')._currentRoute.get('params').get('surahId') - 1];
      this.emitChange();
    }
  }

  getSurahs() {
    return this.surahs;
  }

  hasAllSurahs() {
    return this.surahs.length === 114;
  }

  getSurah() {
    return this.surah;
  }

  getSurahId() {
    return this.surah.id;
  }

  dehydrate() {
    return {
      surahs: this.surahs,
      surah: this.surah
    };
  }
  rehydrate(state) {
    this.surahs = state.surahs;
    this.surah = state.surah;
  }
}

SurahsStore.storeName = 'SurahsStore';
SurahsStore.handlers = {
  'surahsReceived': '_surahsReceived',
  'NAVIGATE_START': '_currentSurahChange'
};

export default SurahsStore;
