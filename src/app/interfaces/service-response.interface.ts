export interface ServiceResponse {
	pets: Pets[];
	dwell_composition: DwellComp[];
	video_content: VideoContent[];
	dwell_struct: DwellStruct[];
	marital_status: MaritalStatus[];
	education: Education[];
	gender: Gender[];
	current_activity: CurrentActivity[];
	isp: Isp[];
	social_network: SocialNetwork[];
	preference_like: PreferenceLike[];
	read_watch: ReadWatch[];
	//OJO FALTA CATEGORY
}

export interface PreferenceLike {
	mspId: number;
	mspShortName: string;
	mspFullName: string;
}

export interface ReadWatch {
	msrId: number;
	msrFullName: string;
	msrShortName: string;
}

//AQUI DEBIERA IR CATEGORY

export interface Pets {
	mptShortName: string;
	mptId: number;
	mptFullName: string;
}

export interface DwellComp {
	dcpFullName: string;
	dcpId: number;
	dcpShortName: string;
}

export interface VideoContent {
	mvcId: number;
	mvcType: string;
	mvcFullName: string;
	mvcLink: string;
}

export interface DwellStruct {
	dstShortName: string;
	dstId: string;
	dstFullName: number;
}

export interface MaritalStatus {
	mmsShortName: string;
	mmsId: number;
	mmsFullName: string;
}

export interface Education {
	eduShortName: string;
	eduId: number;
	eduFullName: string;
}

export interface Gender {
	genId: number;
	genShortName: string;
	genFullName: string;
}

export interface CurrentActivity {
	mcaFullName: string;
	mcaId: number;
	mcaShortName: string;
}

export interface Isp {
	ispShortName: string;
	ispFullName: string;
	ispLink: string;
	ispId: number;
	ispType: number;
}

export interface SocialNetwork {
	msnFullName: string;
	msnLink: string;
	msnId: number;
}
