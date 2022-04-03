import { View, 
        Text, 
        Image, 
        StatusBar,
        ScrollView, 
        TouchableOpacity, 
        Animated, 
        FlatList, 
        TextInput, 
        KeyboardAvoidingView ,
        Platform
    } from 'react-native'
import { useLayoutEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'


import ImageItem from '../components/Home/ImageItem'
import Paginator from '../components/Home/Paginator'
import WriteComment from '../components/Comments/WriteComment'
import Comments from '../components/Comments/Comments'


import { useDispatch, useSelector } from 'react-redux'
import { findPostsById, getListCommentOfPost } from '../redux/actions/postsAction'
import { SafeAreaView } from 'react-native-safe-area-context'
import DeleteCommentModal from '../components/Modal/DeleteCommentModal'



const DetailFeedsScreen = ({route}) => {

    const { postsId } = route.params

    useLayoutEffect(() => {
        dispatch(findPostsById({postsId, token}))
        dispatch(getListCommentOfPost({postsId, token}))
    }, [postsId])


    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { post, listCommentOfPost } = useSelector(state => state.postsReducer)
    const { token } = useSelector(state => state.authReducer)


    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef(null);
    
    const [isVisibleDeleteModal, setVisibleDeleteModal] = useState(false)
    const handleVisibleDeleteModal = () => {
        setVisibleDeleteModal(!isVisibleDeleteModal)
    }

    const [isIdCommentSelected, setIdCommentSelected] = useState(null);

    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    // console.log(listCommentOfPost)

    return (
        <SafeAreaView edges={['bottom']} >
            <View style={tw`bg-white h-full`}>
                <TouchableOpacity
                    style={tw`absolute top-5 left-3 z-50`}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons 
                        name='chevron-back' 
                        size={25}
                        style={tw`text-white`}    
                    />
                </TouchableOpacity>
                <ScrollView 
                    contentContainerStyle={tw`flex items-center`}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <StatusBar hidden={true} />
                    <View style={tw`h-140 w-full bg-gray-200`}>
                        <FlatList
                            data={post.postsImageList}
                            renderItem={ ({item}) => <ImageItem item={item} /> }
                            keyExtractor={item => item.postsImageId}
                            pagingEnabled
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            bounces={false} 
                            onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}],{
                                useNativeDriver: false,
                            })}
                            scrollEventThrottle={32}
                            onViewableItemsChanged={viewableItemsChanged}
                            viewabilityConfig={viewConfig}
                            ref={slidesRef}
                        />
                        <LinearGradient
                            colors={['rgba(0, 0, 0, 0.0003)', 'rgba(0, 0, 0, 0.2)']}
                            style={tw`w-full h-15 py-3 absolute bottom-0 right-0 left-0 flex flex-col justify-end z-0`}
                        >   
                            {/* {(post.postsImageList.length) ? (
                                <Paginator data={post.postsImageList} scrollX={scrollX} />
                            ) : (
                                <></>
                            )} */}
                        
                        </LinearGradient>
                    </View>
                    <View style={tw`w-full px-5`}> 
                        <View style={tw`flex flex-row items-center`}>
                            <View style={tw`flex flex-row items-center justify-between w-full`}>
                                {
                                    post.postsUserList ? (
                                        <View>
                                            <Image
                                                style={tw`w-13 h-13 rounded-full absolute -top-3 bg-gray-300 border border-2 border-white`}
                                                source={post.postsUserList[0].image ? {uri: post.postsUserList[0].image} : require('../assets/images/defaultAvatar.png')}
                                            />
                                            <View style={tw`ml-15 flex`}>
                                                <Text style={tw`font-bold text-base`}>{post.postsUserList[0].name}</Text>  
                                                <Text style={[{fontSize: 11 }, tw`font-light`]}>3 munites ago</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <></>
                                    )
                                }
                                <View style={tw`flex flex-row items-center justify-center bg-gray-100 px-5 py-1 my-2 rounded-xl`}>
                                    <TouchableOpacity
                                        activeOpacity={.7}
                                        style={tw` items-center flex flex-row`}
                                    >
                                        <Text>{post.totalFeel}</Text>
                                        <Ionicons name="heart"
                                            style={ tw`text-[#ED4366] ml-1 mr-3 ml-2`}
                                            size={24}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={.7}
                                        style={tw``}
                                    >
                                        <FontAwesome name="send"
                                            style={tw`text-gray-400`}
                                            size={18}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={tw` my-3  pl-3`}>
                                {post.caption}
                            </Text>
                            
                            <View style={tw`w-full flex justify-center items-center`}>
                                <View style={tw`bg-gray-200 rounded-full w-2/5 h-[1] items-center mt-4 mb-1`} />
                            </View>
                            <Text style={tw`text-center text-gray-500 mb-4`}>
                                        {post.totalComment} comments
                            </Text>
                            {
                                listCommentOfPost ? (
                                    listCommentOfPost.map((item) => {
                                        return <Comments 
                                            item={item} 
                                            key={item.postsCommentId} 
                                            setIdCommentSelected={setIdCommentSelected}    
                                            handleVisibleDeleteModal={handleVisibleDeleteModal}
                                        />
                                    })
                                ) : <></>
                            }
                        </View>
                    </View>
                </ScrollView>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={2}
                >
                    <WriteComment postId={postsId} />
                </KeyboardAvoidingView>
            </View>
            <DeleteCommentModal 
                token={token}
                isVisibleDeleteModal={isVisibleDeleteModal}
                handleVisibleDeleteModal={handleVisibleDeleteModal}
                isIdCommentSelected={isIdCommentSelected}
            />
        </SafeAreaView>
    )
}

export default DetailFeedsScreen