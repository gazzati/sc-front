import {ProfileType} from '../types/types'
import {BaseThunkType, InferActionsTypes} from './'
import {followApi} from '../api/follow-api'
import {usersAPI} from '../api/users-api'
import { ResultCodeEnum } from '../api'

let initialState = {
    following: [] as ProfileType[],
    followers: [] as ProfileType[],
    pageSize: 8,
    totalFriendsCount: 0,
    currentPage: 1,
    isFetching: true,
    unfollowingInProgress: [] as Array<string>  //array of users ids
}

const followReducer = (state = initialState, action: ActionsTypes): InitialState => {
    switch (action.type) {
        case 'follow/SET_FOLLOWING': {
            return { ...state, following: action.following }
        }
        case 'follow/SET_FOLLOWERS': {
            return { ...state, followers: action.followers }
        }
        case 'follow/SET_CURRENT_PAGE': {
            return { ...state, currentPage: action.currentPage }
        }
        case 'follow/SET_TOTAL_USERS_COUNT': {
            return { ...state, totalFriendsCount: action.count }
        }
        case 'follow/TOGGLE_IS_FETCHING': {
            return { ...state, isFetching: action.isFetching }
        }
        case 'follow/UNFOLLOW': {
            return { ...state, following: state.following.filter(user => user._id !== action.userId) }
        }
        case 'follow/TOGGLE_IS_UNFOLLOWING_PROGRESS': {
            return {
                ...state,
                unfollowingInProgress: action.isFetching
                    ? [...state.unfollowingInProgress, action.userId]
                    : state.unfollowingInProgress.filter(id => id !== action.userId)
            }
        }
        default:
            return state
    }
}

export const actions = {
    unfollowSuccess: (userId: string) => ({ type: 'follow/UNFOLLOW', userId } as const),
    setFollowing: (following: ProfileType[]) => ({ type: 'follow/SET_FOLLOWING', following } as const),
    setFollowers: (followers: ProfileType[]) => ({ type: 'follow/SET_FOLLOWERS', followers } as const),
    setCurrentPage: (currentPage: number) => ({ type: 'follow/SET_CURRENT_PAGE', currentPage } as const),
    setTotalFriendsCount: (totalUsersCount: number) => ({
        type: 'follow/SET_TOTAL_USERS_COUNT',
        count: totalUsersCount
    } as const),
    toggleIsFetching: (isFetching: boolean) => ({ type: 'follow/TOGGLE_IS_FETCHING', isFetching } as const),
    toggleUnfollowingProgress: (isFetching: boolean, userId: string) => ({
        type: 'follow/TOGGLE_IS_UNFOLLOWING_PROGRESS',
        isFetching,
        userId
    } as const)
}

// export const requestFriends = (page: number, pageSize: number): ThunkType => {
//     return async (dispatch, getState) => {
//         dispatch(actions.toggleIsFetching(true));   //???
//         dispatch(actions.setCurrentPage(page))

//         let data = await followApi.getFriends(page, pageSize)
//         dispatch(actions.toggleIsFetching(false));
//         dispatch(actions.setFriends(data.items));
//         dispatch(actions.setTotalFriendsCount(data.totalCount))
//     }
// }

export const getFollow = (type: 'followers' | 'following'): ThunkType => {
    return async (dispatch, getState) => {
        dispatch(actions.toggleIsFetching(true))
        //dispatch(actions.setCurrentPage(page))
        if(type === 'following') {
            const res = await followApi.getFollowing()
            dispatch(actions.setFollowing(res.data))
        } else {
            const res = await followApi.getFollowers()
            dispatch(actions.setFollowers(res.data))
        }
        dispatch(actions.toggleIsFetching(false))
        //dispatch(actions.setTotalFriendsCount(data.totalCount))
    }
}

export const requestFollowers = (page: number, pageSize: number): ThunkType => {
    return async (dispatch, getState) => {
        dispatch(actions.toggleIsFetching(true))
        dispatch(actions.setCurrentPage(page))

        let res = await followApi.getFollowers()
        dispatch(actions.toggleIsFetching(false))
        dispatch(actions.setFollowers(res.data))
        //dispatch(actions.setTotalFriendsCount(data.totalCount))
    }
}

export const unfollow = (userId: string): ThunkType => {
    return async (dispatch, getState) => {
        dispatch(actions.toggleIsFetching(true))
        let res = await usersAPI.unFollow(userId)
        if(res.resultCode === ResultCodeEnum.Success) {
            dispatch(actions.unfollowSuccess(userId))
        }
        dispatch(actions.toggleIsFetching(false))
    }
}

export default followReducer

type InitialState = typeof initialState
type ThunkType = BaseThunkType<ActionsTypes>
type ActionsTypes = InferActionsTypes<typeof actions>
