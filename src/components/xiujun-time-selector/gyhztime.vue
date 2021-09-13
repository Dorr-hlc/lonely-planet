<template>
	<view class="container">
		<!-- tab栏 -->
		<scroll-view class="scroll-view_H b-t b-b" scroll-x>
			<block v-for="(item, index) in dateArr" :key="index">
				<view class="flex-box" :class="index == dateActive ? 'onflex-box' : ''" @click="selectDateEvent(index, item)">
					<view class="date-box">
            <view class="days" :style="{ color: index == dateActive ? selectedTabColor : '#666666' }">{{ item.week }}</view>
						<view class="date" :style="{ color: index == dateActive ? selectedTabColor : '#666666' }">{{ item.date }}</view>
					</view>
				</view>
			</block>
		</scroll-view>
    </view>
</template>
<script>
import { dateData } from './hzdata.js';
let maxIndex;
export default {
  props: {
     //选中的tab颜色
		selectedTabColor: {
			type: String,
			default: '#fff'
		},
  },
  data() {
    return {
      dateArr: [], //日期数据
      dateActive: 0, //选中的日期索引
    }
  },
  created(){
    //获取日期tab数据
    this.dateArr = dateData();
    this.data
  },
  methods:{
    selectDateEvent(index, item){
        this.dateActive = index;
        this.selectDate = `${this.dateArr[index]['date']}`;
        this.$emit('selectTime', `${this.selectDate}`);
    },
  }
}
</script>
<style lang="scss" scoped>
.container{
	view,text,image{
		box-sizing: border-box;
	}
	scroll-view{
		width: 100%;
		white-space: nowrap;
    height: 104upx;
   
		position: relative;
	
		.flex-box{
			display: inline-block;
			height: 100%;
      margin:5upx 24upx 5upx 0 ;
      padding: 10upx;
      background: #F4F5FA;
      border-radius:16upx;
			&.active{
				// border-bottom: 4upx solid #0092D5;
				// box-shadow: inset 0 -4upx 0 0 #0092D5;
				.date-box{
					.days{
						color: #FFFFFF;
					}
					.date{
						color: #FFFFFF;
					}
				}
			}
			.date-box{	
				height: 100%;
        line-height: 30upx;
        color: #666666;
        padding: 15upx 0 0 0;
        text-align: center;
				.date{
					color: #666666;
					font-size: 28upx;
					// margin-top: 10upx;
        }
      	.days{
          font-size: 20upx;
					color: #666666;
				}
			}
		}
		.onflex-box{
      background: #07CC86;
    }
  }
}
</style>