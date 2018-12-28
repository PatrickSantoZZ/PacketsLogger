const hexy = require('hexy')
const fs = require('fs');
const util = require('util');
module.exports = function PacketsLogger(mod) {
	const command = mod.command;
	const startTime = Date.now();
	let logFile = fs.createWriteStream('tera-log.log', {
		flags: 'a'
	});
	let logC = false;
	let logS = false;
	let logRaw = true;
	let logRawUnkOnly = false;
	let logJson = true;
	let logUnk = true;
	let logUnkOnly = false;
	let logPaste = false;
	let hook = null;
	let hookEnabled = false;
	let searchExpr = null;

	let blacklist = [
		'S_F2P_PremiumUser_Permission',
		'S_PARTY_MEMBER_INTERVAL_POS_UPDATE',
		'S_PARTY_MEMBER_CHANGE_STAMINA',
		'S_PARTY_MEMBER_ABNORMAL_DEL',
		'S_START_COOLTIME_SKILL',
		'S_MOUNT_VEHICLE',
		'S_SKILL_LIST',
		'S_PARTY_MEMBER_QUEST_DATA',
		'S_PARTY_MEMBER_STAT_UPDATE',
		'S_INSTANCE_ARROW',
		'S_END_USER_PROJECTILE',
		'S_SPAWN_PROJECTILE',
		'S_PARTY_MEMBER_CHANGE_HP',
		'S_PARTY_MEMBER_CHANGE_MP',
		'S_UPDATE_GUILD_MEMBER',
		'C_SAVE_CLIENT_ACCOUNT_SETTING',
		'C_SAVE_CLIENT_USER_SETTING',
		'S_QUEST_INFO',
		'S_CLEAR_WORLD_QUEST_VILLAGER_INFO',
		'C_REQUEST_GUILD_PERK_LIST',
		'S_VISITED_SECTION_LIST',
		'S_GUILD_INFO',
		'S_USER_BLOCK_LIST',
		'S_EVENT_QUEST_SUMMARY',
		'S_DIALOG_EVENT',
		'S_ACTION_STAGE',
		'S_VIEW_PARTY_INVITE',
		'S_UPDATE_FRIEND_INFO',
		'S_DESPAWN_NPC',
		'S_QUEST_VILLAGER_INFO',
		'S_EACH_SKILL_RESULT',
		'S_ACTION_END',
		'S_PLAYER_CHANGE_MP',
		'S_SKILL_PERIOD',
		'C_SIMPLE_TIP_REPEAT_CHECK',
		'S_ABNORMALITY_FAIL',
		'S_INGAMESHOP_PRODUCT_BEGIN',
		'S_INGAMESHOP_PRODUCT_END',
		'S_INGAMESHOP_CATEGORY_END',
		'S_SIMPLE_TIP_REPEAT_CHECK',
		'S_GUILD_MEMBER_LIST',
		'S_GUILD_QUEST_LIST',
		'S_ADD_AWAKEN_CHANGE_DATA',
		'S_SPAWN_NPC',
		'S_SPAWN_USER',
		'S_GUILD_PERK_LIST',
		'S_WORLD_QUEST_VILLAGER_INFO',
		'S_PLAYER_STAT_UPDATE',
		'S_HOLD_ABNORMALITY_ADD',
		'C_SHOW_ITEM_TOOLTIP_EX',
		'S_SHOW_ITEM_TOOLTIP',
		'S_NPC_TARGET_USER',
		'S_EXIT',
		'S_DARK_RIFT_JOIN_LIST',
		'S_ATTENDANCE_EVENT_REWARD_COUNT',
		'S_LOOT_DROPITEM',
		'S_ABNORMALITY_BEGIN',
		'S_COUPON_NOTIFY',
		'S_DUNGEON_CAMERA_SET',
		'S_GET_USER_GUILD_LOGO',
		'S_REPLY_NONDB_ITEM_INFO',
		'S_SPAWN_BONFIRE',
		'S_NPC_AI_EVENT',
		'S_NPC_OCCUPIER_INFO',
		'S_DEFEND_SUCCESS',
		'C_PRESS_SKILL',
		'S_GRANT_SKILL',
		'S_CREATURE_CHANGE_HP',
		'C_SET_TARGET_INFO',
		'S_USER_SITUATION',
		'S_START_CLIENT_CUSTOM_SKILL',
		'S_SKILL_TARGETING_AREA',
		'S_UPDATE_CONTENTS_ON_OFF',
		'S_PLAYER_CHANGE_ALL_PROF',
		'S_ABNORMALITY_END',
		'S_ABNORMALITY_START',
		'S_ABNORMALITY_REFRESH',
		'S_PCBANGINVENTORY_DATALIST',
		'S_SYSTEM_MESSAGE',
		'S_LOAD_CLIENT_ACCOUNT_SETTING',
		'S_LOAD_CLIENT_USER_SETTING',
		'S_USER_STATUS',
		'S_CREATURE_LIFE',
		'S_DEAD_LOCATION',
		'S_SKILL_ATTENTION_TARGET',
		'S_DESPAWN_COLLECTION',
		'S_DECREASE_COOLTIME_SKILL',
		'S_HIT_COMBO',
		'S_UPDATE_NPCGUILD',
		'S_ACCOUNT_PACKAGE_LIST',
		'S_BROCAST_GUILD_FLAG',
		'S_CURRENT_ELECTION_STATE',
		'S_VIRTUAL_LATENCY',
		'S_MOVE_DISTANCE_DELTA',
		'S_DESPAWN_USER',
		'S_PING',
		'C_PONG',
		'C_REQUEST_SEREN_GUIDE',
		'C_NOTIFY_LOCATION_IN_ACTION',
		'S_DEBUG_REMOTE_PROJECTILE_POS',
		'S_DESPAWN_PROJECTILE',
		'S_SOCIAL_CANCEL',
		'S_FINISH_GUILD_QUEST',
		'S_GUILD_MONEY_INFO_CHANGED',
		'S_USER_EXTERNAL_CHANGE',
		'S_SKILL_CATEGORY',
		'S_GUILD_LEVEL_INFO_CHANGED',
		'S_START_ACTION_SCRIPT',
		'S_SYNC_PEGASUS_TIME',
		'S_USER_FLYING_LOCATION',
		'C_PLAYER_FLYING_LOCATION',
		'S_PLAYER_CHANGE_FLIGHT_ENERGY',
		'S_VISIT_NEW_SECTION',
		'S_PVE_LEADER_BOARD_INFO',
		'S_PVP_LEADER_BOARD_INFO',
		'S_GMEVENT_OFF_GUIDE_MESSAGE',
		'S_REQUEST_CITY_WAR_MAP_INFO',
		'C_REQUEST_CITY_WAR_MAP_INFO',
		'S_REQUEST_CITY_WAR_MAP_INFO_END',
		'S_REQUEST_CITY_WAR_MAP_INFO_DETAIL',
		'S_UPDATE_EVENT_SEED_STATE',
		'S_RESULT_EVENT_SEED',
		'S_WEAK_POINT',
		'S_IMAGE_DATA',
		'S_ENABLE_DISABLE_SELLABLE_ITEM_LIST',
		'S_AVAILABLE_EVENT_MATCHING_LIST',
		'S_INVEN',
		'S_VIEW_WARE_EX',
		'S_UPDATE_ACHIEVEMENT_PROGRESS',
		'S_SOCIAL',
		'S_NPC_LOCATION',
		'S_USER_LOCATION',
		'C_PLAYER_LOCATION',
		'S_RESPONSE_GAMESTAT_PONG',
		'S_CHAT',
		'S_PARTY_MATCH_LINK',
		'C_START_SKILL',
		'S_PARTY_MEMBER_ABNORMAL_ADD',
		'S_BATTLE_FIELD_SCORE',
		'S_SHOW_HP',
		'S_NPC_SITUATION',
		'S_REMAIN_PLAY_TIME',
		'S_GET_USER_LIST',
		'S_LOGIN',
		'S_COMPLETED_MISSION_INFO',
		'S_ARTISAN_SKILL_LIST',
		'S_NPCGUILD_LIST',
		'S_TOKEN_POINT_STATUS',
		'S_USER_ITEM_EQUIP_CHANGER',
		'S_LOAD_TOPO',
		'S_ACCOUNT_BENEFIT_LIST',
		'S_FATIGABILITY_POINT',
		'S_SEND_USER_PLAY_TIME',
		'S_INGAMESHOP_CATEGORY_BEGIN',
		'S_FRIEND_GROUP_LIST',
		'S_FRIEND_LIST',
		'S_GUILD_ANNOUNCE',
		'S_PARCEL_READ_RECV_STATUS',
		'S_ONGOING_LEVEL_EVENT_LIST',
		'S_ONGOING_HUNTING_EVENT_LIST',
		'S_JOIN_PRIVATE_CHANNEL',
		'S_PRIVATE_CHAT',
		'S_ADD_AWAKEN_ENCHANT_DATA',
		'S_CREST_INFO',
		'S_GUILD_NAME',
		'S_ITEM_CUSTOM_STRING',
		'S_RESET_CHARM_STATUS',
		'S_LOAD_ACHIEVEMENT_LIST',
		'S_SPAWN_STATUE',
		'S_SPAWN_ME',
		'S_CURRENT_CHANNEL',
		'S_FESTIVAL_LIST',
		'S_UNICAST_FLOATING_CASTLE_INFO',
		'S_DUNGEON_UI_HIGHLIGHT',
		'S_FATIGABILITY_POINT',
		'S_SPAWN_WORKOBJECT',
		'S_INSTANT_MOVE',
		'S_UNICAST_FLOATING_CASTLE_NAMEPLATE',
		'S_DUNGEON_EVENT_MESSAGE',
		'S_BOSS_GAGE_STACK_INFO',
		'S_BOSS_GAGE_INFO',
		'C_CANCEL_SKILL',
		'S_START_STACK_ATTENDANCE_EVENT_INFO',
		'S_SPAWN_DROPITEM',
		'S_DESPAWN_DROPITEM',
		'C_AWESOMIUM_WEB_COUNTING',
		'S_DUNGEON_COOL_TIME_LIST',
		'S_DUNGEON_CLEAR_COUNT_LIST',
		'S_DUNGEON_NEWBIE',
		'S_ANNOUNCE_MESSAGE',
		'S_REIGN_INFO',
		'S_ADD_INTER_PARTY_MATCH_POOL',
		'S_CHANGE_EVENT_MATCHING_STATE',
		'S_NOTIFY_GUILD_QUEST_URGENT',
		'C_START_TARGETED_SKILL',
		'S_INSTANT_DASH',
		'S_CONNECT_SKILL_ARROW',
		'C_HIT_USER_PROJECTILE',
		'S_START_USER_PROJECTILE',
		'S_UPDATE_GUILD_QUEST_STATUS',
		'S_PARTY_INFO',
		'S_HIDE_HP',
		'S_NOTIFY_TO_FRIENDS_WALK_INTO_SAME_AREA',
		'S_UNMOUNT_VEHICLE',
		'S_CHANGE_RELATION',
		'S_PARTY_MEMBER_LIST',
		'S_PARTY_MEMBER_BUFF_UPDATE',
		'S_PARTY_MEMBER_CHARM_RESET',
		'S_PARTY_INFO',
		'S_PARTY_MEMBER_ABNORMAL_REFRESH',
		'S_CREATURE_ROTATE',
		'S_NPC_STATUS',
		'C_CREST_APPLY',
		'S_CREST_APPLY',
		'S_TARGET_INFO',
		'S_USER_LOCATION_IN_ACTION',
		'S_PARTY_MEMBER_ABNORMAL_CLEAR',
		'S_CHANGE_DESTPOS_PROJECTILE',
		'S_QUEST_BALLOON',
 ];

	command.add('logC', () => {
		logC = !logC;
		command.message(`Client packet logging is now ${logC ? 'enabled' : 'disabled'}.`)
		if (!logC && !logS && hookEnabled) disableHook();
		if ((logC || logS) && !hookEnabled) enableHook();

	});

	command.add('logS', () => {
		logS = !logS;
		command.message(`Server packet logging is now ${logS ? 'enabled' : 'disabled'}.`);
		if (!logC && !logS && hookEnabled) disableHook();
		if ((logC || logS) && !hookEnabled) enableHook();
	});

	command.add('logRaw', (arg) => {
		arg = '' + arg
		arg = arg.toLowerCase()

		if (['true', 'yes', 'y', '1'].includes(arg)) {
			logRaw = true
			logRawUnkOnly = false
		} else if (['false', 'no', 'n', '0'].includes(arg)) {
			logRaw = false
			logRawUnkOnly = false
		} else if (['unk', 'u', '2'].includes(arg)) {
			logRaw = true
			logRawUnkOnly = true
		} else {
			logRaw = !logRaw
			logRawUnkOnly = false
		}

		command.message(`Raw packet logging is now ${logRaw ? 'enabled' : 'disabled'}${logRawUnkOnly ? ' (only unknown packets)' : ''}.`)
	});

	command.add('logJson', () => {
		logJson = !logJson
		command.message(`Json packet logging is now ${logJson ? 'enabled' : 'disabled'}.`)
	});

	command.add('logPaste', () => {
		logPaste = !logPaste
		command.message(`Raw packet pasting format is now ${logPaste ? 'enabled' : 'disabled'}.`)
	});

	command.add('logUnk', (arg) => {
		arg = '' + arg
		arg = arg.toLowerCase()

		if (['true', 'yes', 'y', '1'].includes(arg)) {
			logUnk = true
			logUnkOnly = false
		} else if (['false', 'no', 'n', '0'].includes(arg)) {
			logUnk = false
			logUnkOnly = false
		} else if (['only', 'o', '2'].includes(arg)) {
			logUnk = true
			logUnkOnly = true
		} else {
			logUnk = !logUnk
			logUnkOnly = false
		}

		command.message(`Unknown packet logging is now ${logUnk ? 'enabled' : 'disabled'}${logUnkOnly ? ' (only)' : ''}.`)
	});
	command.add('recreate', () => {
		logFile = fs.createWriteStream('tera-log.log', {
			flags: 'a'
		});
	});
	command.add('logSearch', (s) => {
		if (s === '' || s === undefined) s = null
		searchExpr = s;

		if (searchExpr !== null) {
			searchExpr = '' + searchExpr
			command.message(`Logger search expression set to: ${searchExpr}`);
		} else {
			command.message(`Logger search disabled.`);
		}
	});

	command.add('logBlack', (name) => {
		if (name === null || name === undefined) {
			command.message('Invalid');
			return
		}
		var index = blacklist.indexOf(name);
		if (index > -1) {
			blacklist.splice(index, 1);
			command.message('Now showing ' + name + '.');
		} else {
			blacklist.push('' + name);
			command.message('Now hiding ' + name + '.');
		}
	});

	command.add('logBlackShow', (name) => {
		for (let item of blacklist) {
			command.message(item)
		}
	});

	command.add('logBlackClear', (name) => {
		blacklist = []
		command.message(`Logger blacklist cleared.`)
	})

	function pad(n, l, c = '0') {
		return String(c).repeat(l).concat(n).slice(-l);
	}

	function hexDump(data) {
		if (logPaste) {
			return data.toString('hex')
		} else {
			return hexy.hexy(data, {format: "eights", offset: 4, caps: "upper", width: 32})
		}
	}

	function timestamp() {
		let today = new Date();
		return "[" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds() + "]";
	}

	function packetArrow(incoming) {
		return incoming ? '<-' : '->'
	}
	
	function internalType(data) {
		return (data.$fake ? '[CRAFTED]	' : '') + (data.$silenced ? '[BLOCKED]	' : '') + (data.$modified ? '[EDITED]	' : '') + ( (!data.$fake && !data.$silenced && !data.$modified) ? '         	' : '')
	}

	function printUnknown(code, data, incoming, name) {
		logFile.write(`${timestamp()} ${packetArrow(incoming)} ${internalType(data)}    (id ${code}) ${name}\n`);
		if (logRaw) {
			logFile.write(hexDump(data) + '\n');
			logFile.write(data.toString('hex') + '\n');
		}
	}

	function loopBigIntToString(obj) {
		Object.keys(obj).forEach(key => {
			if (obj[key] && typeof obj[key] === 'object') loopBigIntToString(obj[key]);
			else if (typeof obj[key] === "bigint") obj[key] = obj[key].toString();
		});
	}

	function printKnown(name, packet, incoming, code, data, defPerhapsWrong) {
		loopBigIntToString(packet);
		let json = JSON.stringify(packet, null, 4);
		logFile.write(`${timestamp()} ${packetArrow(incoming)} ${internalType(data)} ${name}    (id ${code}${defPerhapsWrong ? ', DEF WRONG!!!)' : ')'}\n`)
		if (logJson) logFile.write(json + '\n')
		if (logRaw && (defPerhapsWrong || !logRawUnkOnly)) {
			logFile.write(hexDump(data) + '\n');
			logFile.write(data.toString('hex') + '\n');
		}
	}

	function isDefPerhapsWrong(name, packet, incoming, data) {
		if (incoming && name.slice(0, 2) === 'C_') {
			return true
		}
		if (!incoming && name.slice(0, 2) === 'S_') {
			return true
		}

		let protocolVersion = mod.protocolVersion
		let data2 = mod.dispatch.protocol.write(protocolVersion, name, '*', packet)
		if ((data.length != data2.length) || !data.equals(data2)) {
			return true
		} else {
			return false
		}
	}

	function shouldPrintKnownPacket(name, code, incoming) {
		if (logUnk && logUnkOnly) return false

		if (incoming) {
			if (!logS) return false
		} else {
			if (!logC) return false
		}

		for (let item of blacklist) {
			if (item === name) {
				return false
			}

			if (item === ('' + code)) {
				return false
			}
		}
		if (searchExpr !== null && !packetMatchesSearch(name, code)) {
			return false
		}

		return true
	}

	function shouldPrintUnknownPacket(name, code, incoming) {
		if (!logUnk) return false

		if (incoming) {
			if (!logS) return false
		} else {
			if (!logC) return false
		}

		for (let item of blacklist) {
			if (item === name) {
				return false
			}

			if (item === ('' + code)) {
				return false
			}
		}

		if (searchExpr !== null && !packetMatchesSearch('', code)) {
			return false
		}

		return true
	}

	function packetMatchesSearch(name, code) {
		if (searchExpr === ('' + code)) {
			return true
		} else {
			if (name !== '' && new RegExp(searchExpr).test(name)) {
				return true
			}
		}

		return false
	}

	function disableHook() {
		hookEnabled = false;
		mod.unhook(hook);
		logFile.write('<---- Hook DISABLED ---->\r\n');
	}

	function enableHook() {
		hookEnabled = true;
		logFile.write('<---- Hook ENABLED ---->\r\n');
		hook = mod.hook('*', 'raw', {
			order: 999999,
			filter: {
				fake: null,
				silenced: null,
				modified: null
			}
		}, (code, data, incoming, fake) => {
			if (!logC && !logS) return

			let protocolVersion = mod.protocolVersion
			let name = null
			let packet = null

			name = mod.dispatch.protocolMap.code.get(code);
			if (name === undefined) name = null;

			if (name) {
				try {
					packet = mod.dispatch.protocol.parse(protocolVersion, code, '*', data)
				} catch (e) {
					packet = null
				}

				if (packet) {
					let defPerhapsWrong = isDefPerhapsWrong(name, packet, incoming, data)
					if (shouldPrintKnownPacket(name, code, incoming)) {
						printKnown(name, packet, incoming, code, data, defPerhapsWrong)
					}
				}
			}

			if (!name || !packet) {
				if (shouldPrintUnknownPacket(name, code, incoming)) {
					printUnknown(code, data, incoming, name)
				}
			}
		});
	}
	if (logS || logC) enableHook();
	this.destructor = function () {
		if (logS || logC) {
			logFile.write('<---- TERA proxy UNLOADED ---->\r\n');
		}
	}
};
